import "server-only";
import { daysAgo, hoursAgo } from "./api";
import { db } from "./supabase";

// shortcut: limits are counted from rows already in the database (checks, leads) instead of a separate
// Redis/KV counter. Fine at launch volumes. Upgrade by moving the IP limit to Upstash when traffic grows.
// The 30-day locks are also enforced by the `leads_30_day_lock` trigger in supabase/migrations/0001_init.sql.

export const MAX_CHECKS_PER_IP_PER_HOUR = 3;
export const LOCK_DAYS = 30;

/** True when this IP already started its allowance of checks in the last hour. */
export async function ipLimited(ipHash: string) {
  const { count } = await db()
    .from("checks")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", hoursAgo(1));
  return (count ?? 0) >= MAX_CHECKS_PER_IP_PER_HOUR;
}

/** True when a verified lead already ran a check for this domain in the last 30 days. */
export async function domainLocked(domain: string, exceptCheckId?: string) {
  let query = db()
    .from("leads")
    .select("id, checks!inner(domain)", { count: "exact", head: true })
    .eq("checks.domain", domain)
    .gte("mobile_verified_at", daysAgo(LOCK_DAYS));
  if (exceptCheckId) query = query.neq("check_id", exceptCheckId);
  const { count } = await query;
  return (count ?? 0) > 0;
}

/** True when this mobile (E.164) already has a verified check in the last 30 days. */
export async function mobileLocked(mobile: string, exceptCheckId?: string) {
  let query = db()
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("mobile", mobile)
    .gte("mobile_verified_at", daysAgo(LOCK_DAYS));
  if (exceptCheckId) query = query.neq("check_id", exceptCheckId);
  const { count } = await query;
  return (count ?? 0) > 0;
}
