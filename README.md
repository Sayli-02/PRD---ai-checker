# Citara (Project Cite)

Landing page, free AI Visibility Check and blog for an SEO + AEO agency. Built with Next.js (App Router), TypeScript, Tailwind CSS and shadcn/ui.

Requirements: `PRD — AI Visibility Landing Page (Codename Project Cite).md`. Build plan: `IMPLEMENTATION_PLAN.md`.

## Setup

1. Install Node 20+ and git. Keep the project outside OneDrive (for example `C:\dev\citara`); OneDrive slows `npm install` and builds a lot.
2. `git clone <repo-url>` and `cd` into it.
3. `npm install`
4. `copy .env.example .env.local` (macOS/Linux: `cp`) and fill in the keys you need.
5. Create the database: run `supabase/migrations/0001_init.sql` in the Supabase SQL editor (or `supabase db push`).
6. `npm run dev` and open http://localhost:3000.
7. Before a pull request: `npm run lint && npm test && npm run build`.

Without API keys the site still runs. The check form needs Supabase and at least one AI key to complete. In development, OTP codes are logged to the server console instead of sent.

## Environment variables

All are listed in `.env.example`. Server-only values never use the `NEXT_PUBLIC_` prefix.

| Variable | Purpose |
| --- | --- |
| `APP_SECRET` | Hashes IPs and OTPs. Required in production. |
| `OPENAI_API_KEY`, `GEMINI_API_KEY`, `PERPLEXITY_API_KEY` | AI engines for the check. Missing engines are skipped. |
| `OPENAI_MODEL`, `GEMINI_MODEL`, `PERPLEXITY_MODEL` | Optional model overrides. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Database. The key stays on the server. |
| `SMS_OTP_API_KEY`, `SMS_OTP_TEMPLATE_ID` | MSG91 OTP (DLT template required in India). |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile bot check. |
| `WEBHOOK_URL` | Receives each completed check (see below). |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_TOKEN`, `NEXT_PUBLIC_CLARITY_ID` | Analytics. |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` | Footer and legal pages. |

## How the check works

1. `/` form posts to `/api/check/start`, which validates the input, checks Turnstile and the rate limits, and returns a check id.
2. `/check?id=…` streams progress from `/api/check/run` (newline-delimited JSON). The run asks 3 engines × 5 questions and stores every answer.
3. The visitor enters name, mobile, email and consent. `/api/check/otp/send` texts a code; `/api/check/otp/verify` checks it.
4. Only after verification does `/api/check/state` return the result. Reloading the page resumes the flow.
5. After verification the webhook and Meta Conversions API fire (with the same `event_id` as the browser pixel).

Limits: 3 checks per IP per hour, one verified check per domain and per mobile per 30 days, 3 OTP sends, 5 OTP attempts, 10 minute expiry, at most 3 runs per check.

Score: the share of answers that name the business, counting 1.0 when it is in the top three and 0.6 otherwise. The business is matched by its domain name (see the `shortcut:` note in `lib/check/analyze.ts`).

## Webhook payload

`POST WEBHOOK_URL` with `content-type: application/json`:

```json
{
  "event": "check.completed",
  "checkId": "uuid",
  "completedAt": "2026-11-02T10:00:00.000Z",
  "lead": {
    "name": "string",
    "mobile": "+919876543210",
    "email": "string",
    "consentAt": "ISO date",
    "verifiedAt": "ISO date",
    "utm": { "utm_source": "…" }
  },
  "business": { "url": "string", "domain": "string", "category": "string", "city": "string" },
  "result": {
    "score": 0,
    "mentions": 0,
    "total": 0,
    "competitors": [{ "name": "string", "count": 0 }],
    "sources": [{ "domain": "string", "count": 0 }],
    "sourceCount": 0
  },
  "answers": [
    {
      "engine": "openai | gemini | perplexity",
      "question": "string",
      "mentioned": true,
      "position": 2,
      "competitors": ["string"],
      "citedUrls": ["string"],
      "raw": "string"
    }
  ]
}
```

`result` is the `CheckResult` type in `lib/check/analyze.ts`. A failed webhook is logged and never blocks the visitor.

## Blog

Posts are MDX files in `content/blog/`. Frontmatter is validated in `lib/content.ts`; a bad post fails the build.

```yaml
---
title: "…"
slug: kebab-case-slug
description: "…"        # under 160 characters, enforced
date: "2026-11-02"
updated: "2026-11-02"
author: "Citara Team"
category: "AEO basics"
tags: ["AEO"]
coverImage: ""          # optional
faq:                    # optional, becomes FAQPage JSON-LD
  - question: "…"
    answer: "…"
---
```

Write 1,000–2,000 words, use question headings, and link only to sources you have opened. Use the `blog-post` skill. Sitemap, RSS (`/rss.xml`) and `/llms.txt` update automatically.

## Rules

- `main` is protected. Every change goes through a pull request with its Vercel preview link.
- Secrets live only in environment variables. Add new ones to `.env.example`.
- Brand values live in `config/brand.ts`; landing copy lives in `content/site.ts`.
- Before changing anything, read the Ponytail rule (`.cursor/rules/ponytail.mdc`): reuse first, add code last.

## Skills used (committed in `.cursor/skills/`)

`impeccable`, `ui-ux-pro-max`, `ponytail`, `brand-config`, `copy-rules`, `blog-post`, `visibility-check`, `pr-checklist`. The always-on Ponytail rule is `.cursor/rules/ponytail.mdc`.

On first use the Impeccable launcher downloads its engine binary (not committed). The design direction is in `.impeccable/surfaces/` and, once documented, `DESIGN.md`.

## Known shortcuts

- No generated Supabase types; rows are cast where read (`lib/check/server.ts`).
- Business matching uses the domain name, not the trading name (`lib/check/analyze.ts`).
- Legal pages (`/privacy`, `/terms`) are drafts and need legal review before launch.
