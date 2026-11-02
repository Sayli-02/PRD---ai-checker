"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Layers, Link2, Lock, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { categories, errorCopy } from "@/content/check";
import { home } from "@/content/home";
import { readUtm, track } from "@/lib/analytics";
import { checkInputSchema, type CheckInput } from "@/lib/schemas";

const f = home.hero.form;
const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// The cream booking card. `location` names where the form sits, for analytics.
export function CheckForm({ location }: { location: "hero" | "final" }) {
  const router = useRouter();
  const uid = useId();
  const [serverError, setServerError] = useState<string | null>(null);
  const [navigating, startTransition] = useTransition(); // keeps the button disabled until /check loads
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
    const token = new FormData(event?.target as HTMLFormElement).get("cf-turnstile-response");
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          turnstileToken: typeof token === "string" ? token : undefined,
          utm: readUtm(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? errorCopy.generic);
        return;
      }
      startTransition(() => router.push(`/check/${data.id}`));
    } catch {
      setServerError(errorCopy.network);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      data-tone="cream"
      aria-labelledby={`${uid}-title`}
      className="rounded-[20px] p-5 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.6)] sm:p-7"
    >
      <h2 id={`${uid}-title`} className="text-[1.65rem] leading-tight sm:text-[1.9rem]">
        {f.title}
      </h2>
      <p className="mt-1.5 text-[0.95rem] text-tone-muted">
        <span className="sm:hidden">{f.introShort}</span>
        <span className="hidden sm:inline">{f.intro}</span>
      </p>

      <div className="mt-4 grid gap-3">
        <Field id={ids.url} label={f.url.label} error={errors.url?.message} className="[&>label]:sr-only">
          <Input
            id={ids.url}
            icon={Link2}
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={f.url.placeholder}
            aria-invalid={!!errors.url}
            aria-describedby={describe("url")}
            {...register("url")}
          />
        </Field>

        <Field id={ids.category} label={f.category.label} error={errors.category?.message} className="[&>label]:sr-only">
          <Select
            id={ids.category}
            icon={Layers}
            defaultValue=""
            aria-invalid={!!errors.category}
            aria-describedby={describe("category")}
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
          </Select>
        </Field>

        <Field id={ids.city} label={f.city.label} error={errors.city?.message} className="[&>label]:sr-only">
          <Input
            id={ids.city}
            icon={MapPin}
            type="text"
            autoComplete="address-level2"
            placeholder={f.city.placeholder}
            aria-invalid={!!errors.city}
            aria-describedby={describe("city")}
            {...register("city")}
          />
        </Field>

        {turnstileKey && (
          <>
            <Script id="turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
            <div className="cf-turnstile" data-sitekey={turnstileKey} data-appearance="interaction-only" />
          </>
        )}

        {serverError && (
          <p role="alert" className="text-sm font-medium text-danger">
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={busy}
          className="mt-1 w-full"
          onClick={() => track("cta_clicked", { location: `${location}_form` })}
        >
          {busy ? f.submitting : f.submit}
          {!busy && <ArrowRight aria-hidden />}
        </Button>

        <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-tone-muted">
          <span className="inline-flex items-center gap-1.5">
            <Zap aria-hidden className="size-3.5" />
            {f.notes[0]}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock aria-hidden className="size-3.5" />
            {f.notes[1]}
          </span>
        </p>
      </div>
    </form>
  );
}
