import { BarChart3, Layers, Link2, Users, Zap } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { checkCopy } from "@/content/check";
import type { CheckResult } from "@/lib/schemas";
import { ScoreGauge } from "./score-gauge";

const r = checkCopy.result;

const stats = (result: CheckResult) =>
  [
    { icon: BarChart3, value: `${result.mentionedCount} / ${result.totalAnswers}`, label: r.statMentioned },
    { icon: Users, value: String(result.competitors.length), label: r.statCompetitors },
    { icon: Link2, value: String(result.sourceCount), label: r.statSources },
    { icon: Zap, value: String(result.quickFixCount), label: r.statFix },
  ] as const;

export function ResultView({ result }: { result: CheckResult }) {
  return (
    <div className="grid gap-10">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <div className="md:order-1 order-2">
          <Eyebrow>{r.eyebrow}</Eyebrow>
          <h1 className="mt-3 text-4xl leading-[1.08] sm:text-5xl">{r.title}</h1>
          <p className="mt-3 max-w-xl text-lg text-tone-muted">
            {result.mentionedCount === 0
              ? r.mentionedZero
              : r.mentioned.replace("{n}", String(result.mentionedCount)).replace("{total}", String(result.totalAnswers))}
          </p>
        </div>
        <div className="order-1 md:order-2">
          <ScoreGauge score={result.score} />
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats(result).map((s) => (
          <li key={s.label} className="rounded-card border border-tone-line bg-tone-surface p-4">
            <s.icon aria-hidden className="size-5 text-accent" />
            <p className="mt-3 font-serif text-3xl leading-none tabular-nums">{s.value}</p>
            <p className="mt-1 text-sm text-tone-muted">{s.label}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-card border border-tone-line bg-tone-surface p-5">
          <h2 className="font-sans text-lg font-semibold tracking-normal">{r.competitorsTitle}</h2>
          {result.competitors.length === 0 ? (
            <p className="mt-3 text-tone-muted">{r.competitorsEmpty}</p>
          ) : (
            <ol className="mt-3 grid gap-2.5">
              {result.competitors.map((c, i) => (
                <li key={c.name} className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent-strong">
                    {i + 1}
                  </span>
                  <span className="font-semibold">{c.name}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="rounded-card bg-accent-strong p-5 text-on-dark">
          <h2 className="flex items-center gap-2 font-sans text-lg font-semibold tracking-normal">
            <Zap aria-hidden className="size-5 text-accent" />
            {r.fixTitle}
          </h2>
          <p className="mt-3 text-on-dark/90">{result.quickFix}</p>
        </div>
      </div>

      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-tone-line pt-5 text-sm text-tone-muted">
        <span className="inline-flex items-center gap-1.5">
          <Layers aria-hidden className="size-4" />
          {r.locked}
        </span>
        <span>{r.snapshot}</span>
      </p>
    </div>
  );
}
