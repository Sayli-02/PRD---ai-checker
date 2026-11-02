"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ChevronDown, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, site } from "@/content/site";
import { track, readUtm } from "@/lib/analytics";
import { checkInputSchema, type CheckInput } from "@/lib/check/schema";
import { Field, controlClass } from "./field";

const f = site.hero.form;
const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// The booking slip: three fields, one amber action. `location` names where the form sits for analytics.
export function CheckForm({ location }: { location: "hero" | "final" }) {
  const router = useRouter();
  const uid = useId();
  const [serverError, setServerError] = useState<string | null>(null);
  const [navigating, startTransition] = useTransition(); // disables the button until /check loads
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckInput>({
    resolver: zodResolver(checkInputSchema),
    defaultValues: { url: "", category: undefined, city: "" },
  });

  const busy = isSubmitting || navigating;
  const ids = { url: `${uid}-url`, category: `${uid}-category`, city: `${uid}-city` };
  const describe = (key: keyof CheckInput) => (errors[key] ? `${ids[key]}-error` : undefined);

  async function onSubmit(values: CheckInput, event?: React.BaseSyntheticEvent) {
    setServerError(null);
    track("check_started", { location });
    // Cloudflare's widget writes its token into a hidden field named cf-turnstile-response.
    const turnstileToken = new FormData(event?.target as HTMLFormElement).get("cf-turnstile-response");
    try {
      const res = await fetch("/api/check/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken, utm: readUtm() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      startTransition(() => router.push(`/check?id=${data.id}`));
    } catch {
      setServerError("We could not reach the server. Check your connection and try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby={`${uid}-title`}
      className="on-paper rounded-lg border-t-[6px] border-t-board bg-slip p-5 text-ink shadow-[0_10px_30px_-12px_rgb(7_27_61/0.55)] sm:p-6"
    >
      <h2 id={`${uid}-title`} className="text-2xl font-bold leading-tight">
        {f.title}
      </h2>
      <p className="mt-1 text-[0.95rem] text-ink-muted">{f.intro}</p>

      <div className="mt-4 grid gap-3.5 border-t border-dashed border-rule pt-4">
        <Field id={ids.url} label={f.url.label} error={errors.url?.message}>
          <Input
            id={ids.url}
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={f.url.placeholder}
            aria-invalid={!!errors.url}
            aria-describedby={describe("url")}
            className={controlClass}
            {...register("url")}
          />
        </Field>

        <Field id={ids.category} label={f.category.label} error={errors.category?.message}>
          <div className="relative">
            <select
              id={ids.category}
              defaultValue=""
              aria-invalid={!!errors.category}
              aria-describedby={describe("category")}
              className={`${controlClass} appearance-none pr-10`}
              {...register("category")}
            >
              <option value="" disabled>
                {f.category.placeholder}
              </option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-ink-muted"
            />
          </div>
        </Field>

        <Field id={ids.city} label={f.city.label} error={errors.city?.message}>
          <Input
            id={ids.city}
            type="text"
            autoComplete="address-level2"
            placeholder={f.city.placeholder}
            aria-invalid={!!errors.city}
            aria-describedby={describe("city")}
            className={controlClass}
            {...register("city")}
          />
        </Field>

        {turnstileKey && (
          <>
            <Script
              id="turnstile"
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              strategy="lazyOnload"
            />
            <div className="cf-turnstile" data-sitekey={turnstileKey} data-appearance="interaction-only" />
          </>
        )}

        {serverError && (
          <p role="alert" className="text-sm font-medium text-missing">
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          disabled={busy}
          className="h-12 w-full gap-2 rounded-md bg-signal text-base font-semibold text-on-signal hover:bg-signal/90"
          onClick={() => track("cta_clicked", { location: `${location}_form` })}
        >
          {busy ? f.submitting : f.submit}
          {!busy && <ArrowRight aria-hidden className="size-5" />}
        </Button>

        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-4" />
            {f.notes[0]}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck aria-hidden className="size-4" />
            {f.notes[1]}
          </span>
        </p>
      </div>
    </form>
  );
}
