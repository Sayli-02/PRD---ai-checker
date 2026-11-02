import { randomUUID, timingSafeEqual } from "node:crypto";
import { after } from "next/server";
import { otpSchema } from "@/lib/check/schema";
import { deliverLead } from "@/lib/check/notify";
import { clientIp, db, hmac, json } from "@/lib/check/server";

const MAX_ATTEMPTS = 5;

type Lead = {
  otp_hash: string | null;
  otp_expires_at: string | null;
  otp_attempts: number;
  verified_at: string | null;
  utm: Record<string, string> | null;
};

const cookie = (header: string | null, name: string) =>
  header?.split(";").map((c) => c.trim().split("=")).find(([k]) => k === name)?.[1];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const parsed = otpSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.issues[0]?.message ?? "Enter the code" }, 400);

  const supabase = db();
  const { data } = await supabase.from("leads").select("*").eq("check_id", id).maybeSingle();
  const lead = data as Lead | null;
  if (!lead?.otp_hash || !lead.otp_expires_at) return json({ error: "Please request a code first." }, 400);
  if (lead.verified_at) return json({ ok: true });
  if (Date.parse(lead.otp_expires_at) < Date.now()) {
    return json({ error: "This code has expired. Please ask for a new one." }, 410);
  }
  if (lead.otp_attempts >= MAX_ATTEMPTS) {
    return json({ error: "Too many wrong codes. Please ask for a new one." }, 429);
  }

  await supabase.from("leads").update({ otp_attempts: lead.otp_attempts + 1 }).eq("check_id", id);

  const given = Buffer.from(hmac(`${id}:${parsed.data.code}`));
  const stored = Buffer.from(lead.otp_hash);
  if (given.length !== stored.length || !timingSafeEqual(given, stored)) {
    return json({ error: "That code is not right. Please try again." }, 400);
  }

  await supabase
    .from("leads")
    .update({ verified_at: new Date().toISOString(), otp_hash: null })
    .eq("check_id", id);

  const eventId = randomUUID();
  const cookies = req.headers.get("cookie");
  const fbclid = lead.utm?.fbclid;
  const ctx = {
    eventId,
    ip: clientIp(req),
    userAgent: req.headers.get("user-agent") ?? "",
    fbp: cookie(cookies, "_fbp"),
    fbc: cookie(cookies, "_fbc") ?? (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined),
    sourceUrl: req.headers.get("referer") ?? "",
  };
  after(() => deliverLead(id, ctx));

  return json({ ok: true, eventId });
}
