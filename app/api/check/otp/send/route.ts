import { randomInt } from "node:crypto";
import { contactSchema, normalizeMobile } from "@/lib/check/schema";
import { sendOtp } from "@/lib/check/notify";
import { daysAgo, db, hmac, json } from "@/lib/check/server";

const MAX_SENDS = 3;
const RESEND_AFTER_MS = 30_000;

type Lead = { otp_sends: number; otp_sent_at: string | null; verified_at: string | null };

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const contact = contactSchema.safeParse(body);
  if (!contact.success) {
    return json({ error: contact.error.issues[0]?.message ?? "Check your details" }, 400);
  }
  const mobile = normalizeMobile(contact.data.mobile)!;
  const supabase = db();

  const { data: check } = await supabase.from("checks").select("status").eq("id", id).maybeSingle();
  if ((check as { status: string } | null)?.status !== "done") {
    return json({ error: "Your check is not ready yet." }, 409);
  }

  const { data: existing } = await supabase.from("leads").select("*").eq("check_id", id).maybeSingle();
  const lead = existing as Lead | null;
  if (lead?.verified_at) return json({ error: "This check is already unlocked." }, 409);
  if (lead) {
    if (lead.otp_sends >= MAX_SENDS) {
      return json({ error: "Too many codes requested. Please start a new check later." }, 429);
    }
    if (lead.otp_sent_at && Date.now() - Date.parse(lead.otp_sent_at) < RESEND_AFTER_MS) {
      return json({ error: "Please wait 30 seconds before asking for another code." }, 429);
    }
  }

  // one check per verified mobile every 30 days
  const { count } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("mobile", mobile)
    .gte("verified_at", daysAgo(30));
  if ((count ?? 0) > 0) {
    return json(
      { error: "This mobile number already ran a check in the last 30 days. Our team will send your report." },
      409,
    );
  }

  const code = String(randomInt(100_000, 1_000_000));
  const now = new Date();
  const { error } = await supabase.from("leads").upsert(
    {
      check_id: id,
      name: contact.data.name,
      mobile,
      email: contact.data.email,
      consent_at: now.toISOString(), // consent time is stored with the lead
      otp_hash: hmac(`${id}:${code}`),
      otp_expires_at: new Date(now.getTime() + 10 * 60_000).toISOString(),
      otp_attempts: 0,
      otp_sends: (lead?.otp_sends ?? 0) + 1,
      otp_sent_at: now.toISOString(),
      utm: body?.utm && typeof body.utm === "object" ? body.utm : null,
    },
    { onConflict: "check_id" },
  );
  if (error) {
    console.error("[otp/send]", error.message);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }

  try {
    await sendOtp(mobile, code);
  } catch (e) {
    console.error("[otp/send]", e);
    return json({ error: "We could not send the code. Please check the number and try again." }, 502);
  }
  return json({ ok: true });
}
