import "server-only";
import { db, sha256 } from "./server";

/** SMS OTP via MSG91 (DLT template). In development without keys the code is logged instead. */
export async function sendOtp(mobile: string, code: string) {
  const authkey = process.env.SMS_OTP_API_KEY;
  const template = process.env.SMS_OTP_TEMPLATE_ID;
  if (!authkey || !template) {
    if (process.env.NODE_ENV === "production") throw new Error("SMS OTP is not configured");
    console.log(`[otp:dev] ${mobile} -> ${code}`);
    return;
  }
  const url = new URL("https://control.msg91.com/api/v5/otp");
  url.search = new URLSearchParams({ template_id: template, mobile: `91${mobile}`, otp: code }).toString();
  const res = await fetch(url, {
    method: "POST",
    headers: { authkey, "content-type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout(10_000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.type === "error") throw new Error(`OTP provider: ${data.message ?? res.status}`);
}

type Rec = Record<string, unknown>;

/**
 * Runs after the OTP is verified: sends the lead + result to WEBHOOK_URL and the
 * `Lead` event to Meta's Conversions API (same event_id as the browser Pixel).
 * Failures are logged; the saved rows are never lost.
 */
export async function deliverLead(
  checkId: string,
  ctx: { eventId: string; ip: string; userAgent: string; fbp?: string; fbc?: string; sourceUrl: string },
) {
  const supabase = db();
  const [{ data: check }, { data: lead }, { data: answers }] = await Promise.all([
    supabase.from("checks").select("*").eq("id", checkId).single(),
    supabase.from("leads").select("*").eq("check_id", checkId).single(),
    supabase.from("answers").select("*").eq("check_id", checkId),
  ]);
  const c = check as Rec | null;
  const l = lead as Rec | null;
  if (!c || !l) return;

  const webhook = process.env.WEBHOOK_URL;
  if (webhook) {
    // Shape documented in README ("Webhook payload").
    const payload = {
      event: "check.completed",
      checkId,
      completedAt: c.completed_at,
      lead: {
        name: l.name,
        mobile: `+91${l.mobile}`,
        email: l.email,
        consentAt: l.consent_at,
        verifiedAt: l.verified_at,
        utm: l.utm ?? {},
      },
      business: { url: c.url, domain: c.domain, category: c.category, city: c.city },
      result: c.result,
      answers: ((answers ?? []) as Rec[]).map((a) => ({
        engine: a.engine,
        question: a.question,
        mentioned: a.mentioned,
        position: a.position,
        competitors: a.competitors,
        citedUrls: a.cited_urls,
        raw: a.raw,
      })),
    };
    await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    }).then(
      (res) => res.ok || console.error("[webhook] HTTP", res.status),
      (error) => console.error("[webhook]", error),
    );
  }

  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (pixel && token) {
    const version = process.env.META_GRAPH_VERSION ?? "v21.0";
    const event = {
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      event_id: ctx.eventId,
      action_source: "website",
      event_source_url: ctx.sourceUrl,
      user_data: {
        em: [sha256(String(l.email).trim().toLowerCase())],
        ph: [sha256(`91${l.mobile}`)],
        client_ip_address: ctx.ip,
        client_user_agent: ctx.userAgent,
        fbp: ctx.fbp,
        fbc: ctx.fbc,
      },
    };
    await fetch(`https://graph.facebook.com/${version}/${pixel}/events?access_token=${token}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data: [event] }),
      signal: AbortSignal.timeout(10_000),
    }).then(
      (res) => res.ok || console.error("[capi] HTTP", res.status),
      (error) => console.error("[capi]", error),
    );
  }
}
