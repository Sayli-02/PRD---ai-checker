import "server-only";
import { ENGINES, type EngineName } from "../content/check.ts";
import { askEngine } from "./engines";
import { buildQuestions } from "./questions";
import { analyzeAnswer, scoreCheck, type Analysis } from "./scoring";
import { db } from "./supabase";
import { deliverIfReady } from "./webhook";

// Below this many usable answers (of 15) the snapshot is too thin to score.
export const MIN_ANSWERS = 8;
export const MAX_RUNS = 4; // the first run plus three retries
export const STALE_AFTER_MS = 100_000; // a "running" check older than this lost its job (function was cut off)

type CheckRow = { id: string; domain: string; category: string; city: string };
type AnswerRow = {
  engine: EngineName;
  status: "ok" | "timeout" | "error";
  mentioned: boolean;
  position: number | null;
  competitors_json: string[];
  citations_json: string[];
};

/**
 * The background job. Asks each engine five questions in parallel (25s per call), saves every answer the
 * moment it lands so the progress screen can poll it, then scores. Safe to call again with only the engines to redo.
 */
export async function runCheck(checkId: string, engines: readonly EngineName[] = ENGINES) {
  const supabase = db();
  try {
    const { data } = await supabase.from("checks").select("id, domain, category, city").eq("id", checkId).single();
    const check = data as CheckRow;
    const questions = buildQuestions(check.category, check.city);

    await Promise.all(
      engines.flatMap((engine) =>
        questions.map(async (question) => {
          const result = await askEngine(engine, question);
          const ok = result.status === "ok";
          const analysis = ok ? analyzeAnswer(result.answerText, result.citations, check.domain) : null;
          await supabase.from("check_answers").upsert(
            {
              check_id: checkId,
              engine,
              question,
              answer_text: result.answerText,
              citations_json: analysis?.citedUrls ?? [],
              status: result.status,
              latency_ms: result.latencyMs,
              mentioned: analysis?.mentioned ?? false,
              position: analysis?.position ?? null,
              competitors_json: analysis?.competitors ?? [],
            },
            { onConflict: "check_id,engine,question" },
          );
        }),
      ),
    );

    await finalize(checkId, check);
  } catch (error) {
    console.error("[check-job]", error);
    await supabase.from("checks").update({ status: "failed" }).eq("id", checkId);
  }
}

async function finalize(checkId: string, check: CheckRow) {
  const supabase = db();
  const { data } = await supabase
    .from("check_answers")
    .select("engine, status, mentioned, position, competitors_json, citations_json")
    .eq("check_id", checkId);
  const rows = (data ?? []) as AnswerRow[];

  if (rows.filter((r) => r.status === "ok").length < MIN_ANSWERS) {
    await supabase.from("checks").update({ status: "failed" }).eq("id", checkId);
    return;
  }

  const analyses: (Analysis | null)[] = rows.map((r) =>
    r.status === "ok"
      ? { mentioned: r.mentioned, position: r.position, competitors: r.competitors_json, citedUrls: r.citations_json }
      : null,
  );
  const result = scoreCheck(analyses, check.domain, check.city);
  await supabase
    .from("checks")
    .update({
      status: "done",
      score: result.score,
      mentioned_count: result.mentionedCount,
      result_json: result,
      completed_at: new Date().toISOString(),
    })
    .eq("id", checkId);

  // If the visitor verified while the check was still running, this is the moment the lead is complete.
  await deliverIfReady(checkId);
}
