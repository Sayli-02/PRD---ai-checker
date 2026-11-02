import { ENGINES, QUESTIONS_PER_ENGINE, TOTAL_ANSWERS } from "@/content/check";
import { isUuid, json } from "@/lib/api";
import { MAX_RUNS, STALE_AFTER_MS } from "@/lib/check-job";
import { progressSchema, resultSchema, type Progress } from "@/lib/schemas";
import { db } from "@/lib/supabase";

type CheckRow = {
  status: "running" | "done" | "failed";
  domain: string;
  category: string;
  city: string;
  run_count: number;
  started_at: string;
  result_json: unknown;
};
type AnswerRow = { engine: (typeof ENGINES)[number]; status: "ok" | "timeout" | "error" };
type LeadRow = { mobile_verified_at: string | null; otp_sent_at: string | null };

// The client polls this every 1.5s. Progress is always returned; the RESULT is built server-side and only
// included when the check is done AND the lead's mobile is verified. It is never sent and hidden with CSS.
export async function GET(_req: Request, ctx: RouteContext<"/api/check/[id]">) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "Check not found" }, 404);

  const supabase = db();
  const [{ data: checkData }, { data: answerData }, { data: leadData }] = await Promise.all([
    supabase
      .from("checks")
      .select("status, domain, category, city, run_count, started_at, result_json")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("check_answers").select("engine, status").eq("check_id", id),
    supabase.from("leads").select("mobile_verified_at, otp_sent_at").eq("check_id", id).maybeSingle(),
  ]);
  const check = checkData as CheckRow | null;
  if (!check) return json({ error: "Check not found" }, 404);
  const answers = (answerData ?? []) as AnswerRow[];
  const lead = leadData as LeadRow | null;

  // A job cut off by the host leaves the check "running" forever; give up on it so the visitor can retry.
  const elapsedMs = Date.now() - Date.parse(check.started_at);
  let status = check.status;
  if (status === "running" && elapsedMs > STALE_AFTER_MS) {
    status = "failed";
    await supabase.from("checks").update({ status: "failed" }).eq("id", id).eq("status", "running");
  }

  const engines = ENGINES.map((engine) => {
    const mine = answers.filter((a) => a.engine === engine);
    const finished = mine.length >= QUESTIONS_PER_ENGINE;
    const anyOk = mine.some((a) => a.status === "ok");
    const engineStatus = finished ? (anyOk ? "done" : "failed") : status === "running" ? "running" : "failed";
    return { engine, status: engineStatus, answersDone: mine.length } as const;
  });

  const verified = !!lead?.mobile_verified_at;
  const answersDone = answers.length;
  const body: Progress = {
    status,
    answersDone,
    totalAnswers: TOTAL_ANSWERS,
    etaSeconds: status === "running" ? Math.max(3, Math.ceil(25 - elapsedMs / 1000)) : 0,
    engines: [...engines],
    business: { domain: check.domain, category: check.category, city: check.city },
    lead: verified ? "verified" : lead?.otp_sent_at ? "otp_sent" : "none",
    canRetry: !verified && status !== "running" && check.run_count < MAX_RUNS && engines.some((e) => e.status === "failed"),
  };
  if (verified && status === "done") {
    const result = resultSchema.safeParse(check.result_json);
    if (result.success) body.result = result.data;
  }
  return json(progressSchema.parse(body));
}
