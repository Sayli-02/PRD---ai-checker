# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (latest stable, App Router) + TypeScript, Tailwind CSS + shadcn/ui, Framer Motion (sparingly), MDX blog, React Hook Form + Zod, Supabase (Postgres), OpenAI / Gemini / Perplexity APIs, Indian DLT-registered SMS OTP provider, Cloudflare Turnstile, GA4 + Meta Pixel/CAPI + Microsoft Clarity, hosted on Vercel. Pinned by the PRD; plain Vite only if Next.js blocks something, with the reason in the README.

## Users

Primary: a business owner or marketing head in India (clinics, restaurants, coaching centres, local services), arriving on a phone from an Instagram or Facebook ad with about 5 seconds of attention. They are not SEO people and do not want to become SEO people.

## Product Purpose

An agency that gets businesses found on Google (SEO) and named and cited inside AI answers from ChatGPT, Gemini and Perplexity (AEO). The team does the work; the client never does SEO themselves.

The website has one job: turn a visitor into a lead by getting them to run a free AI Visibility Check and leave verified contact details. Success: 25%+ of visitors start the check, 50%+ of starters submit contact details.

## Positioning

The free check asks the real AI engines real buyer questions about the visitor's own category and city, live, and shows whether the business is named, who is named instead, and which sources the engines trust. The proof is the visitor's own result, not our claims.

## Operating Context

- Visitor flow: ad, landing page, check form (URL, category, city), live progress screen, contact step with OTP, teaser result, follow-up by the team over call or WhatsApp.
- The check runs 5 buyer-style questions across 3 engines (15 answers) and must finish in under 60 seconds on mobile data.
- The blog is the agency's own proof that it can rank and get cited; posts follow the PRD's research and writing rules.

## Capabilities and Constraints

- One check per verified mobile and one per domain every 30 days; Turnstile plus 3 attempts per IP per hour.
- Results are worded as "a snapshot today"; AI answers change between runs.
- API keys live on the server only.
- Name, logo, colours and fonts live in `/config/brand.ts`; all copy lives in one content file.
- Codebase must grow into client login and dashboard later.
- Undecided: SMS OTP provider, webhook URL and JSON consumer, final brand name (founder picks from a shortlist of 5).

## Brand Commitments

- Working name: **Citara** (cite + "taara", Hindi for star: the business that shines in the answer). Placeholder until the founder's shortlist pick; swappable from `/config/brand.ts`.
- Logo: wordmark plus an icon that works alone at 32 × 32 px, one colour, on light and dark. No magnifying glasses, rockets, generic AI sparkles or purple gradients.
- Copy: short sentences, Indian English, no jargon above the fold, no prices, no guaranteed results.
- Visual reference: `Sample Dashboard.png` is a starting point for layout and structure, not a pinned look.

## Evidence on Hand

- `PRD — AI Visibility Landing Page (Codename Project Cite).md`: full requirements.
- `Sample Dashboard.png`: layout reference for hero + form, trust strip, problem mock, check-shows cards, progress screen and result screen.
- No real testimonials, client logos, case studies or check counts exist. The testimonials section stays hidden and "checks run" numbers are not shown until real.

## Product Principles

1. The check is the product on this page; every section either starts it or removes a reason not to.
2. Show, don't claim: the visitor's own AI answers are the evidence.
3. Honest by default: snapshots, not promises; no fake proof.
4. Done for you: the visitor is never asked to learn SEO.
5. Our own site passes every check we would run on a client's.

## Accessibility & Inclusion

WCAG AA contrast, keyboard-usable form with visible focus and labels on every input, reduced-motion respected, Lighthouse accessibility 95+. Mobile-first at 390 px on mid-range Android over mobile data.
