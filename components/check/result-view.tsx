import { AlertTriangle, CheckCircle2, Lightbulb, Lock } from "lucide-react";
import { WhatsAppLink } from "@/components/whatsapp-link";

export type PublicResult = {
  score: number;
  mentions: number;
  total: number;
  competitors: { name: string; count: number }[];
  sourceCount: number;
  quickFix: string;
};

const SEGMENTS = 20;

function standing(score: number) {
  if (score >= 60) return { label: "Named often", good: true };
  if (score >= 30) return { label: "Named sometimes", good: false };
  if (score > 0) return { label: "Rarely named", good: false };
  return { label: "Not named", good: false };
}

export function ResultView({ result, city }: { result: PublicResult; city: string }) {
  const { label, good } = standing(result.score);
  const lit = Math.round((result.score / 100) * SEGMENTS);
  const rows: [string, string][] = [
    ["AI answers that named you", `${result.mentions} of ${result.total}`],
    ["Competitors named instead", String(result.competitors.length)],
    ["Websites AI quoted", String(result.sourceCount)],
    ["Quick fix for you", "1"],
  ];

  return (
    <div className="grid gap-8">
      <section aria-labelledby="score-title">
        <h1 id="score-title" className="text-4xl font-bold sm:text-5xl">
          Your AI Visibility Score
        </h1>
        <p className="mt-2 text-on-board-muted">
          Your business was named in {result.mentions} of {result.total} AI answers for {city}.
        </p>

        <div className="mt-6 flex items-end gap-4">
          <p className="font-heading text-8xl leading-none font-bold tabular-nums" aria-label={`${result.score} out of 100`}>
            {result.score}
            <span className="text-3xl font-semibold text-on-board-muted">/100</span>
          </p>
          <p
            className={`mb-2 inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-sm font-bold ${
              good ? "bg-confirmed-on-board text-board-deep" : "bg-missing-on-board text-board-deep"
            }`}
          >
            {good ? <CheckCircle2 aria-hidden className="size-4" /> : <AlertTriangle aria-hidden className="size-4" />}
            {label}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-20 gap-1" aria-hidden>
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span
              key={i}
              className={`h-3 rounded-[1px] ${
                i < lit ? (good ? "bg-confirmed-on-board" : "bg-missing-on-board") : "bg-board-line"
              }`}
            />
          ))}
        </div>
      </section>

      <dl className="divide-y divide-board-line border-y border-board-line">
        {rows.map(([term, value]) => (
          <div key={term} className="flex items-baseline justify-between gap-4 py-3">
            <dt className="text-on-board-muted">{term}</dt>
            <dd className="font-heading text-2xl font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      {result.competitors.length > 0 && (
        <section aria-labelledby="competitors-title">
          <h2 id="competitors-title" className="text-2xl font-bold">
            Top {result.competitors.length} named instead
          </h2>
          <ol className="mt-3 divide-y divide-board-line border-y border-board-line">
            {result.competitors.map((c, i) => (
              <li key={c.name} className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 py-3">
                <span className="grid size-9 place-items-center rounded-sm bg-board-deep font-heading text-lg font-bold">
                  {i + 1}
                </span>
                <span className="font-semibold">{c.name}</span>
                <span className="text-sm text-on-board-muted">in {c.count} answers</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section aria-labelledby="fix-title" className="rounded-md bg-board-deep p-5">
        <h2 id="fix-title" className="flex items-center gap-2 text-2xl font-bold">
          <Lightbulb aria-hidden className="size-5 text-signal" />A quick fix for you
        </h2>
        <p className="mt-2">{result.quickFix}</p>
      </section>

      <section
        aria-labelledby="locked-title"
        className="rounded-md border border-dashed border-on-board-muted p-5"
      >
        <h2 id="locked-title" className="flex items-center gap-2 text-2xl font-bold">
          <Lock aria-hidden className="size-5" />
          Our team will send your full report
        </h2>
        <p className="mt-2 text-on-board-muted">
          It covers every AI answer, all the competitors named, the sites AI trusts and a clear plan. We will
          call or message you on WhatsApp, as you agreed.
        </p>
        <WhatsAppLink location="result" className="mt-4 text-on-board" />
      </section>

      <p className="text-sm text-on-board-muted">
        This is a snapshot of today. AI answers change from one run to the next, so it is not a ranking.
      </p>
    </div>
  );
}
