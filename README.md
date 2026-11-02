# Citara (Project Cite)

Landing page, free AI Visibility Check and blog for an SEO + AEO agency. Built with Next.js (App Router), TypeScript, Tailwind CSS and shadcn/ui.

Requirements: `PRD — AI Visibility Landing Page (Codename Project Cite).md`. Build plan: `IMPLEMENTATION_PLAN.md`.

## Setup

1. Install Node 20+ and git.
2. `git clone <repo-url>` and `cd` into it.
3. `npm install`
4. `copy .env.example .env.local` (macOS/Linux: `cp`) and fill in the keys you need.
5. `npm run dev` and open http://localhost:3000.
6. Before a pull request: `npm run lint && npm run build`.

More steps (check flow, blog, webhook JSON, skills) are added as those parts are built.

## Rules

- `main` is protected. Every change goes through a pull request with its Vercel preview link.
- Secrets live only in environment variables. Add new ones to `.env.example`.
- Brand values live in `config/brand.ts`; landing copy lives in `content/site.ts`.

## Skills used (committed in `.cursor/skills/`)

`impeccable`, `ui-ux-pro-max`, `ponytail`, `brand-config`, `copy-rules`, `blog-post`, `visibility-check`, `pr-checklist`. The always-on Ponytail rule is `.cursor/rules/ponytail.mdc`.

On first use the Impeccable launcher downloads its engine binary (not committed).
