import { after } from "next/server";
import { ENGINES, QUESTIONS_PER_ENGINE, errorCopy } from "@/content/check";
import { isUuid, json } from "@/lib/api";
import { MAX_RUNS, runCheck } from "@/lib/check-job";
import { db } from "@/lib/supabase";

export const maxDuration = 60;

/** Re-asks every engine that has no usable answer. Allowed until the visitor verifies, at most three times. */
export async function POST(_req: Request, ctx: RouteContext<"/api/check/[id]/retry">) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "Check not found" }, 404);

  const supabase = db();
  const { data: lead } = await supabase.from("leads").select("mobile_verified_at").eq("check_id", id).maybeSingle();
  if ((lead as { mobile_verified_at: string | null } | null)?.mobile_verified_at) {
    return json({ error: "This check is already complete." }, 409);
  }

  const { data: rows } = await supabase.from("check_answers").select("engine, status").eq("check_id", id);
  const answers = (rows ?? []) as { engine: (typeof ENGINES)[number]; status: string }[];
  // An engine needs a retry when it finished with no usable answer, or never finished (a cut-off job).
  const failed = ENGINES.filter((engine) => {
    const mine = answers.filter((a) => a.engine === engine);
    return !mine.some((a) => a.status === "ok") || mine.length < QUESTIONS_PER_ENGINE;
  });
  if (failed.length === 0) return json({ error: "Nothing to retry." }, 409);

  // Claim the run. If another request got there first (or it is still running) this matches no row.
  const { data: check } = await supabase.from("checks").select("status, run_count").eq("id", id).maybeSingle();
  const current = check as { status: string; run_count: number } | null;
  if (!current) return json({ error: "Check not found" }, 404);
  if (current.run_count >= MAX_RUNS) return json({ error: errorCopy.engineSlow }, 429);
  const { data: claimed } = await supabase
    .from("checks")
    .update({ status: "running", run_count: current.run_count + 1, started_at: new Date().toISOString() })
    .eq("id", id)
    .eq("run_count", current.run_count)
    .in("status", ["done", "failed"])
    .select("id");
  if (!claimed?.length) return json({ error: "This check is already running." }, 409);

  await supabase.from("check_answers").delete().eq("check_id", id).in("engine", failed);
  after(() => runCheck(id, failed));
  return json({ ok: true, engines: failed });
}
