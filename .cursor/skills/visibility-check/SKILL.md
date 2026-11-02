---
name: visibility-check
description: Question templates, scoring formula, JSON output shape, time limits and abuse rules for the free AI Visibility Check. Use when working on the check form, engine calls, scoring, OTP step, result page, rate limits or the webhook.
---

# Visibility check

Code lives in `lib/check/` and `app/api/check/`. API keys are server-only, never in client code.

## Flow

URL + category + city -> progress screen at once -> contact step (name, mobile, email, consent; mobile verified by OTP) -> result.

## Questions and engines

- Build 5 buyer-style questions from category + city, e.g. "best dental clinics in Pune".
- Ask each of OpenAI, Gemini and Perplexity: 15 answers. Run in parallel with `Promise.allSettled` and a per-call timeout.
- Whole check finishes in under 60 s. If an engine times out, show a friendly retry; keep the answers that arrived.
- Save every raw answer with the lead.

## Per answer

Is the business mentioned, at what position, which competitors appear, which websites are cited.

## Score

`score = share of the 15 answers that mention the business, weighted higher for a top-3 position`, shown as 0-100. Keep it one pure function with a test using fixture answers.

## Result shown

Score /100, mentions x/15, top 3 competitors named instead, one quick fix. Everything else is locked: "Our team will send your full report." Word it as "a snapshot today"; never promise rankings.

## Rules

- One check per verified mobile and one per domain every 30 days.
- Cloudflare Turnstile verified server-side; IP limit of 3 attempts per hour.
- Validate with the same Zod schema on client and server.

## Webhook

On completion POST the lead and result as JSON to `WEBHOOK_URL`. The JSON shape is documented in the README; keep the two in sync. A failed webhook is logged and never loses the saved row.

## Events

`check_started`, `otp_sent`, `lead_submitted` (also Meta `Lead` via Pixel + Conversions API, deduplicated by `event_id`), `result_viewed`, `cta_clicked`, `whatsapp_clicked`. Store UTM parameters with each lead.
