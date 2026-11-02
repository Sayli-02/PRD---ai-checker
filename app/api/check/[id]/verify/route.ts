import { randomUUID, timingSafeEqual } from "node:crypto";
import { after } from "next/server";
import { errorCopy } from "@/content/check";
import { clientIp, isUuid, json } from "@/lib/api";
import { hmac } from "@/lib/crypto";
import { domainLocked, mobileLocked } from "@/lib/rate-limit";
import { otpSchema } from "@/lib/schemas";
import { db } from "@/lib/supabase";
import { deliverIfReady } from "@/lib/webhook";

const MAX_ATTEMPTS = 5;

type Lead = {
  mobile: string;
  otp_hash: string | null;
  otp_expires_at: string | null;
  otp_attempts: number;
  mobile_verified_at: string | null;
  event_id: string | null;
};

const cookie = (header: string | null, name: string) =>
  header?.split(";").map((c) => c.trim().split("=")).find(([k]) => k === name)?.[1];

/** Checks the code. On success the result unlocks (server-side) and the webhook fires once the check is done. */
export async function POST(req: Request, ctx: RouteContext<"/api/check/[id]/verify">) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "Check not found" }, 404);

  const body = await req.json().catch(() => null);
  const parsed = otpSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.issues[0]?.message ?? "Enter the code" }, 400);

  const supabase = db();
  const { data } = await supabase.from("leads").select("*").eq("check_id", id).maybeSingle();
  const lead = data as Lead | null;
  if (!lead) return json({ error: "Please request a code first." }, 400);
  if (lead.mobile_verified_at) return json({ ok: true, eventId: lead.event_id });
  if (!lead.otp_hash || !lead.otp_expires_at) return json({ error: "Please request a code first." }, 400);
  if (Date.parse(lead.otp_expires_at) < Date.now()) return json({ error: errorCopy.otpExpired }, 410);
  if (lead.otp_attempts >= MAX_ATTEMPTS) return json({ error: errorCopy.otpTooMany }, 429);

  await supabase.from("leads").update({ otp_attempts: lead.otp_attempts + 1 }).eq("check_id", id);

  const given = Buffer.from(hmac(`${id}:${parsed.data.code}`));
  const stored = Buffer.from(lead.otp_hash);
  if (given.length !== stored.length || !timingSafeEqual(given, stored)) {
    return json({ error: errorCopy.otpWrong }, 400);
  }

  // Friendly errors first; the database trigger is the backstop if two people verify at the same moment.
  const { data: check } = await supabase.from("checks").select("domain").eq("id", id).maybeSingle();
  const domain = (check as { domain: string } | null)?.domain ?? "";
  if (await mobileLocked(lead.mobile, id)) return json({ error: errorCopy.mobileLocked }, 409);
  if (await domainLocked(domain, id)) return json({ error: errorCopy.domainLocked }, 409);

  const cookies = req.headers.get("cookie");
  const utm = (await supabase.from("leads").select("utm_json").eq("check_id", id).maybeSingle()).data as {
    utm_json: Record<string, string> | null;
  } | null;
  const fbclid = utm?.utm_json?.fbclid;
  const eventId = randomUUID();
  const { error } = await supabase
    .from("leads")
    .update({
      mobile_verified_at: new Date().toISOString(),
      otp_hash: null,
      event_id: eventId,
      user_agent: req.headers.get("user-agent") ?? null,
      fbp: cookie(cookies, "_fbp") ?? null,
      fbc: cookie(cookies, "_fbc") ?? (fbclid ? `fb.1.${Date.now()}.${fbclid}` : null),
    })
    .eq("check_id", id);
  if (error) {
    if (error.code === "23505") {
      return json({ error: error.message.includes("domain") ? errorCopy.domainLocked : errorCopy.mobileLocked }, 409);
    }
    console.error("[verify]", error.message);
    return json({ error: errorCopy.generic }, 500);
  }

  after(() => deliverIfReady(id, { ip: clientIp(req), sourceUrl: req.headers.get("referer") ?? undefined }));
  return json({ ok: true, eventId });
}
