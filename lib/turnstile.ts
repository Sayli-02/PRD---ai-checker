import "server-only";
import { getEnv } from "./env";

/** Cloudflare Turnstile. Without a secret it is skipped in development only; production fails closed. */
export async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = getEnv().TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    });
    return (await res.json()).success === true;
  } catch {
    return false;
  }
}
