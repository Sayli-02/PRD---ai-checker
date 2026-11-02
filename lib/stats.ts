import "server-only";
import { cacheLife } from "next/cache";
import { db } from "./supabase";

/** Real number of completed checks, or null when the database is not reachable. Never a made-up figure. */
export async function getCheckCount(): Promise<number | null> {
  "use cache";
  cacheLife("hours");
  try {
    const { count, error } = await db().from("checks").select("id", { count: "exact", head: true }).eq("status", "done");
    return error ? null : (count ?? null);
  } catch {
    return null;
  }
}
