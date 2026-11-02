import { after } from "next/server";
import { errorCopy } from "@/content/check";
import { clientIp, json } from "@/lib/api";
import { runCheck } from "@/lib/check-job";
import { hmac } from "@/lib/crypto";
import { domainLocked, ipLimited } from "@/lib/rate-limit";
import { createCheckSchema, normalizeDomain } from "@/lib/schemas";
import { db } from "@/lib/supabase";
import { verifyTurnstile } from "@/lib/turnstile";

// The background job runs after the response, so the visitor is sent to the progress screen at once.
// Vercel: confirm the plan allows this duration (60s needs Pro, or Hobby with fluid compute).
export const maxDuration = 60;

/** Creates the check after Turnstile, IP rate-limit and 30-day domain-lock, then starts the job. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createCheckSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.issues[0]?.message ?? "Check your details" }, 400);

  try {
    const ip = clientIp(req);
    if (!(await verifyTurnstile(parsed.data.turnstileToken ?? undefined, ip))) {
      return json({ error: errorCopy.turnstile }, 400);
    }

    const { url, category, city, utm } = parsed.data;
    const domain = normalizeDomain(url)!;
    const ipHash = hmac(ip);

    if (await ipLimited(ipHash)) return json({ error: errorCopy.rateLimited }, 429);
    if (await domainLocked(domain)) return json({ error: errorCopy.domainLocked }, 409);

    const { data, error } = await db()
      .from("checks")
      .insert({ url, domain, category, city, ip_hash: ipHash, utm_json: utm ?? null })
      .select("id")
      .single();
    if (error || !data) {
      console.error("[check:create]", error?.message);
      return json({ error: errorCopy.generic }, 500);
    }

    const id = (data as { id: string }).id;
    after(() => runCheck(id));
    return json({ id }, 201);
  } catch (error) {
    console.error("[check:create]", error instanceof Error ? error.message : error);
    return json({ error: errorCopy.generic }, 500);
  }
}
