import { checkInputSchema, normalizeDomain } from "@/lib/check/schema";
import { clientIp, daysAgo, db, hmac, hoursAgo, json, verifyTurnstile } from "@/lib/check/server";

// Creates the check row after bot, rate-limit and 30-day-domain checks. Does not call any AI engine.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = checkInputSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: parsed.error.issues[0]?.message ?? "Check your details" }, 400);
  }

  const ip = clientIp(req);
  if (!(await verifyTurnstile(body?.turnstileToken, ip))) {
    return json({ error: "We could not confirm you are human. Please try again." }, 400);
  }

  const { url, category, city } = parsed.data;
  const domain = normalizeDomain(url)!;
  const ipHash = hmac(ip);
  const supabase = db();

  // 3 attempts per IP per hour
  const { count: recent } = await supabase
    .from("checks")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", hoursAgo(1));
  if ((recent ?? 0) >= 3) {
    return json({ error: "Too many checks from this connection. Please try again in an hour." }, 429);
  }

  // one verified check per domain every 30 days
  const { count: done } = await supabase
    .from("leads")
    .select("id, checks!inner(domain)", { count: "exact", head: true })
    .eq("checks.domain", domain)
    .gte("verified_at", daysAgo(30));
  if ((done ?? 0) > 0) {
    return json(
      { error: "This website was already checked in the last 30 days. Our team will send your report." },
      409,
    );
  }

  const utm = body?.utm && typeof body.utm === "object" ? body.utm : null;
  const { data, error } = await supabase
    .from("checks")
    .insert({ url, domain, category, city, ip_hash: ipHash, utm })
    .select("id")
    .single();
  if (error || !data) {
    console.error("[check/start]", error?.message);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
  return json({ id: (data as { id: string }).id });
}
