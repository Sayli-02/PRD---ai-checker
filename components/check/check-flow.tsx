"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, LoaderCircle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { checkCopy, engineLabels, errorCopy, ENGINES, type EngineName } from "@/content/check";
import { track } from "@/lib/analytics";
import { progressSchema, type EngineStatus, type Progress } from "@/lib/schemas";
import { ContactStep } from "./contact-step";
import { ResultView } from "./result-view";

const p = checkCopy.progress;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function EngineRow({
  engine,
  status,
  onRetry,
  retrying,
}: {
  engine: EngineName;
  status: EngineStatus;
  onRetry?: () => void;
  retrying?: boolean;
}) {
  return (
    <li className="flex items-center gap-4 rounded-card border border-tone-line bg-tone-surface px-4 py-3">
      <span aria-hidden className="grid size-9 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent-strong">
        {engineLabels[engine][0]}
      </span>
      <span className="flex-1 font-semibold">{engineLabels[engine]}</span>
      {status === "done" && <Check aria-label="Done" className="size-5 text-success" />}
      {status === "running" && <LoaderCircle aria-label="Running" className="size-5 animate-spin text-accent" />}
      {status === "waiting" && <span aria-label="Waiting" className="size-5 rounded-full border-2 border-tone-line" />}
      {status === "failed" && (
        <span className="flex items-center gap-2">
          <AlertTriangle aria-hidden className="size-5 text-warning" />
          {onRetry && (
            <Button type="button" variant="ghost" size="sm" disabled={retrying} onClick={onRetry}>
              {p.retry}
            </Button>
          )}
        </span>
      )}
    </li>
  );
}

export function CheckFlow({ id, contactDuringProgress }: { id: string; contactDuringProgress: boolean }) {
  const [state, setState] = useState<Progress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const viewed = useRef(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/check/${id}`, { cache: "no-store" });
    if (res.status === 404) {
      setError("notfound");
      return null;
    }
    const json = await res.json();
    const parsed = progressSchema.safeParse(json);
    if (!parsed.success) {
      setError(errorCopy.generic);
      return null;
    }
    setState(parsed.data);
    setError(null);
    return parsed.data;
  }, [id]);

  const valid = UUID.test(id);

  useEffect(() => {
    if (!valid) return;
    let timer: number;
    let stop = false;
    const tick = async () => {
      try {
        const next = await load();
        if (stop || !next) return;
        const waiting = next.status === "running" || (next.lead === "verified" && next.status !== "failed" && !next.result);
        if (waiting) timer = window.setTimeout(tick, 1500);
      } catch {
        if (!stop) setError(errorCopy.network);
      }
    };
    tick();
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, [valid, load]);

  useEffect(() => {
    if (state?.result && !viewed.current) {
      viewed.current = true;
      track("result_viewed", { score: state.result.score });
    }
  }, [state]);

  async function retry() {
    setRetrying(true);
    try {
      const res = await fetch(`/api/check/${id}/retry`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? errorCopy.engineSlow);
        return;
      }
      await load();
    } finally {
      setRetrying(false);
    }
  }

  if (!valid || error === "notfound") {
    return (
      <div data-tone="dark" className="min-h-dvh">
        <Header ctaHref="/#check" />
        <Section tone="dark" containerClassName="py-20 text-center">
          <h1 className="text-4xl">{checkCopy.notFound.title}</h1>
          <p className="mt-3 text-tone-muted">{checkCopy.notFound.body}</p>
          <Link href="/#check" className="mt-6 inline-block font-semibold underline">
            {checkCopy.result.checkAgain}
          </Link>
        </Section>
      </div>
    );
  }

  const engines = state?.engines ?? ENGINES.map((engine) => ({ engine, status: "waiting" as const, answersDone: 0 }));
  const showContact = state && state.lead !== "verified" && (contactDuringProgress || state.status !== "running");
  const showResult = state?.result;

  return (
    <div data-tone="dark" className="min-h-dvh">
      <Header
        ctaHref="/#check"
        ctaLabel={showResult ? checkCopy.result.checkAgain : undefined}
        sticky={!showResult}
      />
      <Section tone="dark" containerClassName="max-w-3xl py-10 md:py-16">
        {showResult ? (
          <ResultView result={showResult} />
        ) : (
          <div className="grid gap-8">
            <div className="text-center">
              <Eyebrow>{p.eyebrow}</Eyebrow>
              <h1 className="mt-3 text-4xl leading-[1.08] sm:text-5xl">{p.title}</h1>
              <p className="mt-2 text-tone-muted">{p.subtitle}</p>
            </div>

            <ol className="grid gap-2.5">
              {engines.map((row) => (
                <EngineRow
                  key={row.engine}
                  engine={row.engine}
                  status={row.status}
                  onRetry={state?.canRetry && row.status === "failed" ? retry : undefined}
                  retrying={retrying}
                />
              ))}
            </ol>

            {state && (
              <div>
                <div className="mb-2 flex justify-between text-sm text-tone-muted">
                  <span>
                    {p.processing.replace("{done}", String(state.answersDone)).replace("{total}", String(state.totalAnswers))}
                  </span>
                  {state.status === "running" && <span>{p.eta.replace("{seconds}", String(state.etaSeconds))}</span>}
                </div>
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={state.totalAnswers}
                  aria-valuenow={state.answersDone}
                  aria-live="polite"
                  className="h-2 overflow-hidden rounded-full bg-tone-line"
                >
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-500"
                    style={{ width: `${Math.min(100, (100 * state.answersDone) / state.totalAnswers)}%` }}
                  />
                </div>
              </div>
            )}

            {error && error !== "notfound" && (
              <p role="alert" className="text-center text-sm font-medium text-danger">
                {error}
              </p>
            )}

            {state?.lead === "verified" && !showResult && (
              <p className="text-center text-tone-muted">{p.waiting}</p>
            )}

            {showContact && (
              <ContactStep
                checkId={id}
                stage={state.lead === "otp_sent" ? "otp_sent" : "none"}
                onSent={() => load()}
                onVerified={() => load()}
              />
            )}
          </div>
        )}
      </Section>
    </div>
  );
}
