"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { checkCopy, errorCopy } from "@/content/check";
import { readUtm, track } from "@/lib/analytics";
import { contactSchema, otpSchema, type ContactInput } from "@/lib/schemas";

const c = checkCopy.contact;

export function ContactStep({
  checkId,
  stage,
  onSent,
  onVerified,
}: {
  checkId: string;
  stage: "none" | "otp_sent";
  onSent: () => void;
  onVerified: (eventId?: string) => void;
}) {
  const uid = useId();
  const [serverError, setServerError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [saved, setSaved] = useState<ContactInput | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const contact = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", mobile: "", email: "" },
  });
  const otp = useForm<{ code: string }>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  async function sendLead(values: ContactInput) {
    setServerError(null);
    try {
      const res = await fetch(`/api/check/${checkId}/lead`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, utm: readUtm() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? errorCopy.generic);
        return;
      }
      track("otp_sent");
      setSaved(values);
      setCooldown(data.resendAfterSeconds ?? 30);
      onSent();
    } catch {
      setServerError(errorCopy.network);
    }
  }

  async function verify({ code }: { code: string }) {
    setServerError(null);
    try {
      const res = await fetch(`/api/check/${checkId}/verify`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? errorCopy.generic);
        return;
      }
      track("lead_submitted", {}, data.eventId);
      onVerified(data.eventId);
    } catch {
      setServerError(errorCopy.network);
    }
  }

  return (
    <div className="rounded-card border border-tone-line bg-tone-surface p-5 sm:p-6">
      <h2 className="text-2xl leading-tight">{c.title}</h2>
      <p className="mt-1 text-tone-muted">{c.why}</p>

      {stage === "none" ? (
        <form onSubmit={contact.handleSubmit(sendLead)} noValidate className="mt-4 grid gap-3">
          <Field id={`${uid}-name`} label={c.name} error={contact.formState.errors.name?.message}>
            <Input
              id={`${uid}-name`}
              autoComplete="name"
              aria-invalid={!!contact.formState.errors.name}
              {...contact.register("name")}
            />
          </Field>
          <Field id={`${uid}-mobile`} label={c.mobile} error={contact.formState.errors.mobile?.message}>
            <div className="flex">
              <span className="grid shrink-0 place-items-center rounded-l-control border border-r-0 border-line-cream bg-cream px-3 text-tone-muted">
                +91
              </span>
              <div className="min-w-0 flex-1">
                <Input
                  id={`${uid}-mobile`}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  className="rounded-l-none"
                  aria-invalid={!!contact.formState.errors.mobile}
                  {...contact.register("mobile")}
                />
              </div>
            </div>
          </Field>
          <Field id={`${uid}-email`} label={c.email} error={contact.formState.errors.email?.message}>
            <Input
              id={`${uid}-email`}
              type="email"
              autoComplete="email"
              aria-invalid={!!contact.formState.errors.email}
              {...contact.register("email")}
            />
          </Field>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-accent-strong"
              {...contact.register("consent")}
            />
            <span>
              {c.consent}{" "}
              <Link href="/privacy" target="_blank" className="font-semibold underline">
                Privacy
              </Link>{" "}
              and{" "}
              <Link href="/terms" target="_blank" className="font-semibold underline">
                Terms
              </Link>
              .
            </span>
          </label>
          {contact.formState.errors.consent && (
            <p role="alert" className="text-sm font-medium text-danger">
              {contact.formState.errors.consent.message}
            </p>
          )}
          {serverError && (
            <p role="alert" className="text-sm font-medium text-danger">
              {serverError}
            </p>
          )}
          <Button type="submit" size="lg" disabled={contact.formState.isSubmitting} className="mt-1">
            {contact.formState.isSubmitting ? c.sending : c.sendOtp}
          </Button>
        </form>
      ) : (
        <form onSubmit={otp.handleSubmit(verify)} noValidate className="mt-4 grid gap-3">
          <Field id={`${uid}-otp`} label={c.code} error={otp.formState.errors.code?.message}>
            <Input
              id={`${uid}-otp`}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              aria-invalid={!!otp.formState.errors.code}
              {...otp.register("code")}
            />
          </Field>
          {serverError && (
            <p role="alert" className="text-sm font-medium text-danger">
              {serverError}
            </p>
          )}
          <Button type="submit" size="lg" disabled={otp.formState.isSubmitting}>
            {otp.formState.isSubmitting ? c.verifying : c.verify}
          </Button>
          {saved && (
            <Button
              type="button"
              variant="ghost"
              disabled={cooldown > 0}
              onClick={() => sendLead(saved)}
            >
              {cooldown > 0 ? c.resendIn.replace("{seconds}", String(cooldown)) : c.resend}
            </Button>
          )}
        </form>
      )}
    </div>
  );
}
