import { analyzeAnswer, scoreCheck } from "@/lib/check/analyze";
import { askAll, type RawAnswer } from "@/lib/check/engines";
import { buildQuestions } from "@/lib/check/questions";
import { db, json } from "@/lib/check/server";

export const maxDuration = 60;

const MIN_ANSWERS = 8; // of 15; below this the snapshot is too thin to score
const MAX_RUNS = 3;

type CheckRow = {
  id: string;
  status: string;
  run_count: number;
  domain: string;
  category: string;
  city: string;
};

// Streams newline-delimited JSON: {type:"answer",...} per finished call, then {type:"done"} or {type:"error"}.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const supabase = db();

  const { data } = await supabase.from("checks").select("*").eq("id", id).maybeSingle();
  const check = data as CheckRow | null;
  if (!check) return json({ error: "Check not found" }, 404);
  if (!["created", "failed"].includes(check.status) || check.run_count >= MAX_RUNS) {
    return json({ error: "This check cannot be started again." }, 409);
  }

  // Claim the run; if another request got there first the update matches no row.
  const { data: claimed } = await supabase
    .from("checks")
    .update({ status: "running", run_count: check.run_count + 1 })
    .eq("id", id)
    .eq("status", check.status)
    .select("id");
  if (!claimed?.length) return json({ error: "This check is already running." }, 409);

  const questions = buildQuestions(check.category, check.city);
  const total = questions.length * 3;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: unknown) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      let done = 0;
      try {
        const answers = await askAll(questions, (a: RawAnswer) => {
          done++;
          send({ type: "answer", engine: a.engine, ok: a.text !== null, done, total });
        });

        const valid = answers.filter((a) => a.text !== null);
        if (valid.length < MIN_ANSWERS) {
          await supabase.from("checks").update({ status: "failed" }).eq("id", id);
          send({ type: "error", message: "One of the AI tools is slow right now. Please try again." });
          return;
        }

        const analyses = answers.map((a) =>
          a.text === null ? null : analyzeAnswer(a.text, a.citations, check.domain),
        );
        const result = scoreCheck(
          analyses.filter((a): a is NonNullable<typeof a> => a !== null),
          check.domain,
          check.city,
        );

        // Every raw answer is saved with the check, including failed calls.
        await supabase.from("answers").insert(
          answers.map((a, i) => ({
            check_id: id,
            engine: a.engine,
            question: a.question,
            raw: a.text,
            mentioned: analyses[i]?.mentioned ?? false,
            position: analyses[i]?.position ?? null,
            competitors: analyses[i]?.competitors ?? [],
            cited_urls: analyses[i]?.citedUrls ?? [],
          })),
        );
        await supabase
          .from("checks")
          .update({
            status: "done",
            score: result.score,
            mentions: result.mentions,
            total_answers: result.total,
            result,
            completed_at: new Date().toISOString(),
          })
          .eq("id", id);
        send({ type: "done" });
      } catch (error) {
        console.error("[check/run]", error);
        await supabase.from("checks").update({ status: "failed" }).eq("id", id);
        send({ type: "error", message: "Something went wrong. Please try again." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "content-type": "application/x-ndjson", "cache-control": "no-store" },
  });
}
