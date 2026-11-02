"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { readUtm, track } from "@/lib/analytics";
import { contactSchema, otpSchema, type ContactInput } from "@/lib/check/schema";
import { Field, controlClass } from "./field";
import { ResultView, type PublicResult } from "./result-view";

const ENGINES = [
  { key: "openai", label: "ChatGPT" },
  { key: "gemini", label: "Gemini" },
  { key: "perplexity", label: "Perplexity" },
] as const;
type EngineKey = (typeof ENGINES)[number]["key"];

const PER_ENGINE = 5;
const TOTAL = PER_ENGINE * ENGINES.length;
const zero: Record<EngineKey, number> = { openai: 0, gemini: 0, perplexity: 0 };

type Phase =
  | { name: "loading" }
  | { name: "running" }
  | { name: "error"; message: string; canRetry: boolean }
  | { name: "contact" }
  | { name: "otp" }
  | { name: "result"; result: PublicResult; city: string };

const submitClass =
  "h-12 w-full rounded-md bg-signal text-base font-semibold text-on-signal hover:bg-signal/90";

async function post(path: string, body: unknown) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, data: await res.json().catch(() => ({})) };
}

export function CheckFlow() {
  const id = useSearchParams().get("id") ?? "";
  const [phase, setPhase] = useState<Phase>({ name: "loading" });
  const [counts, setCounts] = useState(zero);
  const contact = useRef<ContactInput | null>(null);
  const started = useRef(false);

  const showResult = useCallback(
    async (fresh: boolean) => {
      const res = await fetch(`/api/check/state?id=${id}`);
      const data = await res.json();
      if (data.status !== "verified") {
        setPhase({ name: "error", message: "We could not load your result.", canRetry: false });
        return;
      }
      setPhase({ name: "result", result: data.result, city: data.business.city });
      if (fresh) track("result_viewed");
    },
    [id],
  );

  const run = useCallback(async () => {
    setCounts(zero);
    setPhase({ name: "running" });
    let finished = false;
    try {
      const res = await fetch("/api/check/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setPhase({ name: "error", message: data.error ?? "Something went wrong.", canRetry: false });
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines.filter(Boolean)) {
          const event = JSON.parse(line);
          if (event.type === "answer") {
            setCounts((c) => ({ ...c, [event.engine as EngineKey]: c[event.engine as EngineKey] + 1 }));
          } else if (event.type === "done") {
            finished = true;
            setPhase({ name: "contact" });
          } else if (event.type === "error") {
            finished = true;
            setPhase({ name: "error", message: event.message, canRetry: true });
          }
        }
      }
      if (!finished) throw new Error("stream ended early");
    } catch {
      // The connection dropped. The server may still have finished, so ask it.
      const data = await fetch(`/api/check/state?id=${id}`).then((r) => r.json()).catch(() => null);
      setPhase(
        data?.status === "done"
          ? { name: "contact" }
          : { name: "error", message: "Your connection dropped. Please try again.", canRetry: data?.status === "failed" },
      );
    }
  }, [id]);

  useEffect(() => {
    if (started.current) return; // React strict mode runs effects twice in development
    started.current = true;
    (async () => {
      const data = await fetch(`/api/check/state?id=${id}`).then((r) => r.json()).catch(() => null);
      switch (data?.status) {
        case "created":
          return run();
        case "done":
          return setPhase({ name: "contact" });
        case "verified":
          return showResult(false);
        case "failed":
          return setPhase({ name: "error", message: "That check did not finish.", canRetry: true });
        case "running":
          return setPhase({ name: "error", message: "That check was interrupted.", canRetry: false });
        default:
          return setPhase({ name: "error", message: "We could not find this check.", canRetry: false });
      }
    })();
  }, [id, run, showResult]);

  return (
    <div aria-live="polite">
      {phase.name === "loading" && <p className="text-on-board-muted">Loading your check…</p>}

      {phase.name === "running" && <Progress counts={counts} />}

      {phase.name === "error" && (
        <div role="alert" className="grid gap-4">
          <h1 className="text-4xl font-bold">We could not finish your check</h1>
          <p className="text-on-board-muted">{phase.message}</p>
          {phase.canRetry ? (
            <Button onClick={run} className={submitClass}>
              Try again
            </Button>
          ) : (
            <Link href="/#check" className="font-semibold underline">
              Start a new check
            </Link>
          )}
        </div>
      )}

      {phase.name === "contact" && (
        <ContactStep
          id={id}
          onSent={(values) => {
            contact.current = values;
            setPhase({ name: "otp" });
          }}
        />
      )}

      {phase.name === "otp" && contact.current && (
        <OtpStep
          id={id}
          contact={contact.current}
          onBack={() => setPhase({ name: "contact" })}
          onVerified={async (eventId) => {
            track("lead_submitted", {}, eventId);
            await showResult(true);
          }}
        />
      )}

      {phase.name === "result" && <ResultView result={phase.result} city={phase.city} />}
    </div>
  );
}

function Progress({ counts }: { counts: Record<EngineKey, number> }) {
  const done = ENGINES.reduce((n, e) => n + counts[e.key], 0);
  const percent = Math.round((done / TOTAL) * 100);
  return (
    <section aria-labelledby="progress-title">
      <h1 id="progress-title" className="text-4xl font-bold sm:text-5xl">
        Running your check…
      </h1>
      <p className="mt-2 text-on-board-muted">
        We are asking ChatGPT, Gemini and Perplexity about your business.
      </p>

      <ul className="mt-6 divide-y divide-board-line border-y border-board-line">
        {ENGINES.map(({ key, label }) => {
          const n = counts[key];
          const complete = n >= PER_ENGINE;
          return (
            <li key={key} className="grid grid-cols-[1.75rem_1fr_auto] items-center gap-3 py-4">
              {complete ? (
                <CheckCircle2 aria-hidden className="size-6 text-confirmed-on-board" />
              ) : n > 0 ? (
                <Loader2 aria-hidden className="size-6 motion-safe:animate-spin" />
              ) : (
                <Circle aria-hidden className="size-6 text-on-board-muted" />
              )}
              <span className="font-heading text-xl font-semibold">{label}</span>
              <span className="text-sm text-on-board-muted tabular-nums">
                {complete ? "Done" : `${n} of ${PER_ENGINE} answers`}
              </span>
            </li>
          );
        })}
      </ul>

      <div
        role="progressbar"
        aria-label="Check progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-6 h-3 rounded-[2px] bg-board-line"
      >
        <div className="h-full rounded-[2px] bg-signal transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-sm text-on-board-muted tabular-nums">
        {done} of {TOTAL} answers. Usually under 60 seconds.
      </p>
    </section>
  );
}

function ContactStep({ id, onSent }: { id: string; onSent: (v: ContactInput) => void }) {
  const uid = useId();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", mobile: "", email: "", consent: false as unknown as true },
  });
  const f = (k: string) => `${uid}-${k}`;

  async function onSubmit(values: ContactInput) {
    setError(null);
    const { ok, data } = await post("/api/check/otp/send", { id, ...values, utm: readUtm() });
    if (!ok) return setError(data.error ?? "Something went wrong. Please try again.");
    track("otp_sent");
    onSent(values);
  }

  return (
    <section aria-labelledby="contact-title">
      <h1 id="contact-title" className="text-4xl font-bold sm:text-5xl">
        Your check is ready.
      </h1>
      <p className="mt-2 text-on-board-muted">
        Enter your details to see your score. We will send a code to confirm your mobile.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="on-paper mt-6 grid gap-3.5 rounded-lg bg-slip p-5 text-ink"
      >
        <Field id={f("name")} label="Your name" error={errors.name?.message}>
          <Input id={f("name")} autoComplete="name" aria-invalid={!!errors.name} className={controlClass} {...register("name")} />
        </Field>
        <Field id={f("mobile")} label="Mobile number" error={errors.mobile?.message}>
          <div className="relative">
            <span aria-hidden className="absolute top-1/2 left-3 -translate-y-1/2 font-semibold text-ink-muted">
              +91
            </span>
            <Input
              id={f("mobile")}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              aria-invalid={!!errors.mobile}
              className={`${controlClass} pl-12`}
              {...register("mobile")}
            />
          </div>
        </Field>
        <Field id={f("email")} label="Email" error={errors.email?.message}>
          <Input
            id={f("email")}
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={controlClass}
            {...register("email")}
          />
        </Field>

        <div className="grid gap-1.5">
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              aria-invalid={!!errors.consent}
              className="mt-0.5 size-5 shrink-0 accent-board"
              {...register("consent")}
            />
            <span>
              I agree that the team may call me or message me on WhatsApp about my report. I have read the{" "}
              <Link href="/privacy" target="_blank" className="font-semibold underline">
                privacy policy
              </Link>
              .
            </span>
          </label>
          {errors.consent && (
            <p role="alert" className="text-sm font-medium text-missing">
              {errors.consent.message}
            </p>
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-missing">
            {error}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting} className={submitClass}>
          {isSubmitting ? "Sending code" : "Send code"}
        </Button>
        <p className="text-sm text-ink-muted">
          We ask only for what we need to send your report and talk to you about it.
        </p>
      </form>
    </section>
  );
}

function OtpStep({
  id,
  contact,
  onBack,
  onVerified,
}: {
  id: string;
  contact: ContactInput;
  onBack: () => void;
  onVerified: (eventId: string) => Promise<void>;
}) {
  const uid = useId();
  const [error, setError] = useState<string | null>(null);
  const [wait, setWait] = useState(30);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ code: string }>({ resolver: zodResolver(otpSchema), defaultValues: { code: "" } });

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function verify({ code }: { code: string }) {
    setError(null);
    const { ok, data } = await post("/api/check/otp/verify", { id, code });
    if (!ok) return setError(data.error ?? "Something went wrong. Please try again.");
    await onVerified(data.eventId);
  }

  async function resend() {
    setError(null);
    const { ok, data } = await post("/api/check/otp/send", { id, ...contact, utm: readUtm() });
    if (!ok) return setError(data.error ?? "Could not send a new code.");
    track("otp_sent");
    setWait(30);
  }

  return (
    <section aria-labelledby="otp-title">
      <h1 id="otp-title" className="text-4xl font-bold sm:text-5xl">
        Enter the code
      </h1>
      <p className="mt-2 text-on-board-muted">We sent a 6-digit code to +91 {contact.mobile}.</p>

      <form
        onSubmit={handleSubmit(verify)}
        noValidate
        className="on-paper mt-6 grid gap-3.5 rounded-lg bg-slip p-5 text-ink"
      >
        <Field id={`${uid}-code`} label="6-digit code" error={errors.code?.message}>
          <Input
            id={`${uid}-code`}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            aria-invalid={!!errors.code}
            className={`${controlClass} text-center font-heading text-2xl tracking-[0.4em]`}
            {...register("code")}
          />
        </Field>
        {error && (
          <p role="alert" className="text-sm font-medium text-missing">
            {error}
          </p>
        )}
        <Button type="submit" disabled={isSubmitting} className={submitClass}>
          {isSubmitting ? "Checking" : "Show my score"}
        </Button>
        <div className="flex flex-wrap justify-between gap-3 text-sm">
          <button type="button" onClick={resend} disabled={wait > 0} className="font-semibold underline disabled:no-underline disabled:opacity-60">
            {wait > 0 ? `Send a new code in ${wait}s` : "Send a new code"}
          </button>
          <button type="button" onClick={onBack} className="font-semibold underline">
            Change number
          </button>
        </div>
      </form>
    </section>
  );
}
