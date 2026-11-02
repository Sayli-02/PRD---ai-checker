import "server-only";
import { createHash, createHmac } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// shortcut: no generated database types, so rows are cast where they are read. Upgrade by running
// `supabase gen types typescript` and passing the Database type here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: SupabaseClient<any> | undefined;

/** Server-only Supabase client (service-role key). */
export function db() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set");
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}

function secret() {
  const value = process.env.APP_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") throw new Error("APP_SECRET is not set");
  return "dev-only-secret";
}

/** Keyed hash for IPs and OTPs, so raw values are never stored. */
export const hmac = (value: string) => createHmac("sha256", secret()).update(value).digest("hex");
export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip") || "unknown";
}

export const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();
export const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();

export const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "cache-control": "no-store" } });

/** Cloudflare Turnstile. Without a secret it is skipped in development only. */
export async function verifyTurnstile(token: string | undefined, ip: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return process.env.NODE_ENV !== "production";
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: secretKey, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    });
    return (await res.json()).success === true;
  } catch {
    return false;
  }
}
