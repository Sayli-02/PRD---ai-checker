import { randomInt } from "node:crypto";
import { checkCopy, errorCopy } from "@/content/check";
import { isUuid, json } from "@/lib/api";
import { hmac } from "@/lib/crypto";
import { DEV_FIXED_CODE, getOtpProvider, usesDevCode } from "@/lib/otp/provider";
import { mobileLocked } from "@/lib/rate-limit";
import { leadSchema, normalizeMobile } from "@/lib/schemas";
import { db } from "@/lib/supabase";

const MAX_SENDS = 3;
const RESEND_AFTER_MS = 30_000;
const OTP_TTL_MS = 5 * 60_000;

type Lead = { otp_sends: number; otp_sent_at: string | null; mobile_verified_at: string | null };

/** Stores the contact details (unverified, with the consent wording and time) and texts a code. Allowed while the check runs. */
export async function POST(req: Request, ctx: RouteContext<"/api/check/[id]/lead">) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "Check not found" }, 404);

  const body = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.issues[0]?.message ?? "Check your details" }, 400);

  const mobile = `+91${normalizeMobile(parsed.data.mobile)!}`;
  const supabase = db();

  const { data: check } = await supabase.from("checks").select("id").eq("id", id).maybeSingle();
  if (!check) return json({ error: "Check not found" }, 404);

  const { data: existing } = await supabase.from("leads").select("otp_sends, otp_sent_at, mobile_verified_at").eq("check_id", id).maybeSingle();
  const lead = existing as Lead | null;
  if (lead?.mobile_verified_at) return json({ error: "This check is already unlocked." }, 409);
  if (lead) {
    if (lead.otp_sends >= MAX_SENDS) return json({ error: errorCopy.otpTooMany }, 429);
    if (lead.otp_sent_at && Date.now() - Date.parse(lead.otp_sent_at) < RESEND_AFTER_MS) {
      return json({ error: errorCopy.otpCooldown }, 429);
    }
  }
  if (await mobileLocked(mobile, id)) return json({ error: errorCopy.mobileLocked }, 409);

  const code = usesDevCode() ? DEV_FIXED_CODE : String(randomInt(100_000, 1_000_000));
  const now = new Date();
  const { error } = await supabase.from("leads").upsert(
    {
      check_id: id,
      name: parsed.data.name,
      mobile,
      email: parsed.data.email,
      consent_at: now.toISOString(),
      consent_text: checkCopy.contact.consent,
      otp_hash: hmac(`${id}:${code}`),
      otp_expires_at: new Date(now.getTime() + OTP_TTL_MS).toISOString(),
      otp_attempts: 0,
      otp_sends: (lead?.otp_sends ?? 0) + 1,
      otp_sent_at: now.toISOString(),
      utm_json: parsed.data.utm ?? null,
    },
    { onConflict: "check_id" },
  );
  if (error) {
    console.error("[lead]", error.message);
    return json({ error: errorCopy.generic }, 500);
  }

  try {
    await getOtpProvider().send(mobile, code);
  } catch (e) {
    console.error("[lead:otp]", e);
    return json({ error: "We could not send the code. Please check the number and try again." }, 502);
  }
  return json({ ok: true, resendAfterSeconds: RESEND_AFTER_MS / 1000 });
}
