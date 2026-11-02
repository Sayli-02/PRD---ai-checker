import "server-only";
import { sha256 } from "./crypto";
import { getEnv } from "./env";
import { db } from "./supabase";

type Row = Record<string, unknown>;

/** Browser details the Conversions API wants. IP is only available when called from the verify request itself. */
export type DeliveryContext = { ip?: string; sourceUrl?: string };

const BACKOFF_MS = [0, 1_000, 3_000]; // three attempts

const utmPart = (utm: unknown, key: string) => {
  const value = utm && typeof utm === "object" ? (utm as Record<string, unknown>)[`utm_${key}`] : undefined;
  return typeof value === "string" ? value : "";
};

async function postWithRetry(url: string, payload: unknown) {
  let lastError = "";
  for (let attempt = 0; attempt < BACKOFF_MS.length; attempt++) {
    if (BACKOFF_MS[attempt]) await new Promise((r) => setTimeout(r, BACKOFF_MS[attempt]));
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) return { ok: true as const, attempts: attempt + 1, error: null };
      lastError = `HTTP ${res.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  return { ok: false as const, attempts: BACKOFF_MS.length, error: lastError };
}

/**
 * Runs once a check is done AND its lead's mobile is verified, whichever happens last. Both the verify route
 * and the check job call it; the atomic claim below makes sure it fires exactly once.
 * Sends the lead + result to WEBHOOK_URL (3 tries, delivery status stored on the lead) and the `Lead`
 * event to Meta's Conversions API with the same event_id as the browser Pixel.
 */
export async function deliverIfReady(checkId: string, ctx: DeliveryContext = {}) {
  const supabase = db();
  const { data: check } = await supabase.from("checks").select("*").eq("id", checkId).maybeSingle();
  const c = check as Row | null;
  if (!c || c.status !== "done") return;

  const { data: claimed } = await supabase
    .from("leads")
    .update({ webhook_status: "sending" })
    .eq("check_id", checkId)
    .not("mobile_verified_at", "is", null)
    .is("webhook_status", null)
    .select("*");
  const l = (claimed as Row[] | null)?.[0];
  if (!l) return; // not verified yet, or already delivered by the other caller

  const { WEBHOOK_URL, NEXT_PUBLIC_META_PIXEL_ID, META_CAPI_TOKEN, META_GRAPH_VERSION } = getEnv();

  let status: "delivered" | "failed" = "delivered";
  let attempts = 0;
  let error: string | null = null;

  if (WEBHOOK_URL) {
    const { data: answers } = await supabase.from("check_answers").select("engine").eq("check_id", checkId);
    const result = (c.result_json ?? {}) as Row;
    const payload = {
      event: "check.completed",
      version: 1,
      checkId,
      createdAt: c.created_at,
      lead: {
        name: l.name,
        mobile: l.mobile,
        email: l.email,
        consentAt: l.consent_at,
        mobileVerifiedAt: l.mobile_verified_at,
      },
      business: { website: c.url, domain: c.domain, category: c.category, city: c.city },
      result: {
        score: result.score,
        band: result.band,
        mentionedCount: result.mentionedCount,
        totalAnswers: result.totalAnswers,
        competitors: result.competitors,
        topSources: result.topSources,
        quickFix: result.quickFix,
      },
      rawAnswersRef: `check_answers rows for checkId (${(answers ?? []).length} rows)`,
      utm: {
        source: utmPart(l.utm_json, "source"),
        medium: utmPart(l.utm_json, "medium"),
        campaign: utmPart(l.utm_json, "campaign"),
        term: utmPart(l.utm_json, "term"),
        content: utmPart(l.utm_json, "content"),
      },
      meta: { ipHash: c.ip_hash, userAgent: l.user_agent ?? "" },
    };
    const outcome = await postWithRetry(WEBHOOK_URL, payload);
    attempts = outcome.attempts;
    error = outcome.error;
    status = outcome.ok ? "delivered" : "failed";
    if (!outcome.ok) console.error("[webhook] failed after", attempts, "attempts:", error);
  }

  await supabase
    .from("leads")
    .update({
      webhook_status: status,
      webhook_attempts: attempts,
      webhook_error: error,
      webhook_delivered_at: status === "delivered" ? new Date().toISOString() : null,
    })
    .eq("id", l.id as string);

  if (NEXT_PUBLIC_META_PIXEL_ID && META_CAPI_TOKEN) {
    const event = {
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      event_id: l.event_id,
      action_source: "website",
      event_source_url: ctx.sourceUrl,
      user_data: {
        em: [sha256(String(l.email).trim().toLowerCase())],
        ph: [sha256(String(l.mobile).replace("+", ""))],
        client_ip_address: ctx.ip,
        client_user_agent: l.user_agent,
        fbp: l.fbp ?? undefined,
        fbc: l.fbc ?? undefined,
      },
    };
    const url = `https://graph.facebook.com/${META_GRAPH_VERSION ?? "v21.0"}/${NEXT_PUBLIC_META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`;
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data: [event] }),
      signal: AbortSignal.timeout(10_000),
    }).then(
      (res) => res.ok || console.error("[capi] HTTP", res.status),
      (e) => console.error("[capi]", e),
    );
  }
}
