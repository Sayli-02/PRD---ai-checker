# Citeo (Project Cite)

Landing page, free AI Visibility Check and blog for an SEO + AEO agency. Working name is a placeholder: change it in `config/brand.ts`.

Build plan: `CURSOR_PLAN.md`. Requirements: `docs/PRD — AI Visibility Landing Page (Codename Project Cite).md`. Visual source of truth: `design/Sample Dashboard.png`.

## Setup

1. Install Node 20+ and git. Prefer a folder outside OneDrive (for example `C:\dev\citeo`).
2. `git clone <repo-url>` and `cd` into it.
3. `npm install`
4. `copy .env.example .env.local` (macOS/Linux: `cp`) and fill in the keys you need.
5. `npm run dev` and open http://localhost:3000.
6. In development, open http://localhost:3000/styleguide to see every base component on dark and cream.
7. Before a pull request: `npm run lint && npm test && npm run build`.

Without API keys the site still runs. The check needs Supabase and at least one AI key to finish. In development, OTP codes are logged to the server console instead of sent.

Later phases also need the SQL in `supabase/migrations/` run in the Supabase SQL editor.

## Environment variables

All are listed in `.env.example` and validated by `lib/env.ts` at server start. Server-only values never use the `NEXT_PUBLIC_` prefix.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin. |
| `IP_HASH_SALT` | Hashes IPs and OTPs. Required in production (16+ characters). |
| `OPENAI_API_KEY`, `GEMINI_API_KEY`, `PERPLEXITY_API_KEY` | AI engines. At least one required in production. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Database. The key stays on the server. |
| `OTP_PROVIDER_KEY`, `OTP_DLT_TEMPLATE_ID`, `OTP_SENDER_ID` | MSG91 OTP (DLT template required in India). |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile. |
| `WEBHOOK_URL` | Receives each completed, verified check. |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_TOKEN`, `NEXT_PUBLIC_CLARITY_ID` | Analytics. |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` | Footer and legal pages. |

## Brand and copy

- Name, colours, fonts, logo path and feature flags: `config/brand.ts`.
- Landing copy: `content/home.ts`. Check copy (categories, questions, bands): `content/check.ts`.
- Tokens are written to `:root` by `app/layout.tsx` and mapped in `app/globals.css`.

## Adding a blog post

Add an MDX file in `content/blog/` with Zod-validated frontmatter (`title`, `slug`, `description` under 160 characters, `date`, `updated`, `author`, `category`, `tags`, optional `coverImage` and `faq`). Sitemap, RSS and the Open Graph image update from that file. Use the `blog-post` skill.

## Rules

- `main` is protected. Every change goes through a pull request with its Vercel preview link.
- Secrets live only in environment variables. Add new ones to `.env.example` and `lib/env.ts`.
- Work phase by phase from `CURSOR_PLAN.md`. Consult Ponytail before adding code.

## Skills used (committed in `.cursor/skills/`)

`impeccable`, `ui-ux-pro-max`, `ponytail`, `brand-config`, `copy-rules`, `blog-post`, `visibility-check`, `pr-checklist`. Always-on rules: `.cursor/rules/cursor-plan.mdc`, `.cursor/rules/ponytail.mdc`.
