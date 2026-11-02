# Implementation Plan: Citara (Project Cite)

Source of truth: `PRD — AI Visibility Landing Page (Codename Project Cite).md`. Product record: `PRODUCT.md`. Layout reference: `Sample Dashboard.png` (starting point, not a pinned look).

Design process follows **Impeccable** (`~/.cursor/skills/impeccable`). Every build action passes the **Ponytail gate** first (`.cursor/rules/ponytail.mdc`).

---

## How an agent executes this plan

For every task, in this order:

1. **Read** the task, the PRD section it cites, and the code it touches.
2. **Ponytail gate.** Run the Ponytail ladder and print one line before writing anything:
   `Ponytail: <reuse | platform | installed dep | new code> — <what>; skipped: <what>`
   Each task below lists its expected answer under **Ponytail**. If the agent's answer adds more than that, it must say why.
3. **Impeccable gate (UI tasks only).** Read `reference/craft-floor.md` immediately before the edit, and work inside the direction contract in the surface brief.
4. **Build** the smallest complete change that meets the task's **Done when**.
5. **Verify** at 390 px and 1440 px. UI tasks run the Impeccable detector once the section is finished.
6. **Before the PR:** `/ponytail-review`, Lighthouse mobile, preview link attached (`pr-checklist` skill).

Never cut, whatever Ponytail says: validation at trust boundaries, security, accessibility, anything the PRD requires.

### Surfaces and Impeccable modes

| Surface | Mode | What success looks like |
| --- | --- | --- |
| Landing page `/` | Persuade | Visitor starts the check within seconds |
| Check flow (progress, contact/OTP, result) | Operate, inside the landing world | Visitor finishes and leaves details |
| `/blog`, `/blog/[slug]` | Read | Reader gets the answer, then the check CTA |
| `/privacy`, `/terms`, 404 | Read | Plain and findable |

Only the landing page gets a new visual world. Everything else inherits it; no second identity exercise.

### Tooling roles (avoids the PRD's "two skills designing at once" conflict)

- **Impeccable** owns the visual direction, every section build, critique, audit and polish, and writes `DESIGN.md` at the end.
- **UI UX Pro Max** is a data source only: query it for palette, font-pairing and UX-rule candidates that feed Impeccable's direction round. It does not design pages.
- **Ponytail** owns how little code delivers each decision.

---

## Phase 0 — Repo and project setup (Week 1)

**0.1 Scaffold the app**
- `create-next-app` (App Router, TypeScript, Tailwind, ESLint), then `shadcn init`.
- **Ponytail:** platform. Generators only; no custom config beyond what they write.
- **Done when:** `npm run dev` serves a blank page; Vercel preview deploys from a PR.

**0.2 Commit the skills and rules into the repo**
- Copy `impeccable`, `ui-ux-pro-max`, `ponytail` into `.cursor/skills/`; keep `.cursor/rules/ponytail.mdc`.
- Write the five custom skills with `/create-skill`: `brand-config`, `copy-rules`, `blog-post`, `visibility-check`, `pr-checklist`.
- **Ponytail:** reuse. Copies, not rewrites; each custom skill under one screen.
- **Done when:** both interns' agents load the same skills from the repo.

**0.3 Repo rules**
- Protected `main`, PR-only, `.env.example` with every key listed below, README skeleton.
- **Ponytail:** platform (GitHub branch protection, Vercel previews).

**0.4 Folder skeleton**

```
app/                     routes (/, /blog, /blog/[slug], /privacy, /terms, not-found, api/check/*)
components/sections/     one file per landing section
components/check/        form, progress, contact, result
config/brand.ts          name, logo paths, colours, fonts
content/site.ts          all landing copy
content/blog/*.mdx       posts
lib/check/               questions, engines, scoring
lib/content.ts           the one function that loads blog posts
```

- **Ponytail:** no `utils/`, `hooks/` or `types/` folders until something real needs them.

---

## Phase 1 — Brand and design direction (Week 1)

**1.1 Name shortlist**
- Working name **Citara** (cite + "taara", Hindi for star). Shortlist four more against the PRD rules (1–2 words, under 10 letters, easy in English and Hindi, not India-only, no "SEO"). Candidates to check: Citara, Namely, Beaconly, Answera, Kahin.
- For each: `.com`/`.in`, Instagram, LinkedIn, IP India trademark search. One-page sheet.
- **Ponytail:** skip. Research task, no code.
- **Done when:** founder picks; `config/brand.ts` updated.

**1.2 Impeccable `init` (done)**
- `PRODUCT.md` is written. Re-run only if the founder changes product facts.

**1.3 Impeccable `shape` for the landing page**
- Run `/impeccable shape landing page`. Confirm the brief: audience, the check as the focal moment, 13 sections from the PRD, anti-goals (fake proof, prices, guarantees, AI-sparkle clichés).
- **Done when:** the user confirms the brief.

**1.4 Design-system inputs from UI UX Pro Max**
- Query it for an Indian SMB / agency / trust-led product: 3 palette candidates, 3 font pairings, UX rules for mobile lead forms.
- Hand the output to 1.5 as candidate material. Do not apply it to code.

**1.5 Impeccable direction round (new visual world)**
- Follow `reference/new-work.md` section 3, "Create or replace the visual world":
  - Name the mechanism: *"we ask the AI engines your customers ask, and show you whether you're in the answer."*
  - List seven visual systems from the audience's world (Indian business life, print, signage, everyday screens). The sample mockup counts as one candidate, alongside the UI UX Pro Max output.
  - Run `impeccable concept-seed --scope direction --mode persuade`, then present through `impeccable serve-question`. The user locks a direction.
- Known tension to resolve in the round: the mockup sits close to a pattern Impeccable flags as AI-default (cream ground, high-contrast serif, soft purple), and the PRD bans purple gradients. Its *layout* is strong and stays: hero with the form beside the headline, a mock AI answer, a card grid, a progress screen, a score ring.
- Build path: image generation is available, so ask once for comp-first or code-first and record it in `.impeccable/config.json`.
- **Done when:** direction contract (THESIS, OWN-WORLD, STORY, FIRST VIEWPORT, FORM + seed reference, FINISH) is written with `impeccable surface-brief write app/page.tsx` and read back.

**1.6 Logo and brand sheet**
- 2–3 logo directions inside the locked world, then final SVG master, PNG 512/1024, favicon set, OG image 1200 × 630.
- **Ponytail:** platform. `app/icon.svg`, `app/apple-icon.png` and `app/opengraph-image.png` file conventions, not a favicon package.

**1.7 `config/brand.ts` and tokens**
- Name, logo paths, colour hexes, two fonts. Tailwind theme and shadcn CSS variables read from it; fonts via `next/font`.
- **Ponytail:** one plain exported object. No theme provider, no runtime theming.
- **Done when:** changing `brand.ts` alone changes name, logo, colours and fonts everywhere (acceptance item 1).

**1.8 Mobile wireframes**
- All 13 sections at 390 px, in the locked direction. If comp-first: the Impeccable comp round (three comps, one approved) replaces wireframes for the first viewport.

---

## Phase 2 — Landing page sections (Week 2)

Applies to every task in this phase:
- Mode Persuade. Read `craft-floor.md` before editing. Build inside the direction contract.
- Copy lives in `content/site.ts`; components only read it.
- **Ponytail default:** shadcn primitives (`Button`, `Input`, `Select`, `Accordion`, `Card`) restyled in the world's vocabulary; server components unless the section is interactive; no carousel or animation library beyond Framer Motion.

| # | Task | Ponytail (expected) | Done when |
| --- | --- | --- | --- |
| 2.1 | `content/site.ts` with all copy from the PRD rules | One typed object; no i18n lib | Copy edits need no component change |
| 2.2 | Header: logo, 3 links, CTA scrolls to `#check` | `<a href="#check">` + CSS `scroll-behavior` | Keyboard + 390 px OK |
| 2.3 | Hero + check form (URL, category, city) | RHF + Zod schema shared with the server | Form fully visible without scroll at 390 × 844 |
| 2.4 | Trust strip: engine names as text | Static markup; checks-run number hidden until real | No logos, no fake counts |
| 2.5 | The problem: designed mock AI answer | HTML/CSS mock, labelled as an example | Reads at 390 px; marked illustrative |
| 2.6 | What the check shows: 4 cards | One `.map` over content | Matches PRD's four items |
| 2.7 | How we work: audit, optimise, track | Static list | "Our team does it" is unmissable |
| 2.8 | SEO vs AEO comparison | Semantic `<table>` or two lists | Plain words, no jargon |
| 2.9 | Sample report, blurred | One static image + CSS `filter: blur` | No layout shift |
| 2.10 | Testimonials | Component renders `null` when the list is empty | Hidden at launch |
| 2.11 | Latest 3 blog posts | `getPosts()` from `lib/content.ts` | Auto-updates on new MDX |
| 2.12 | FAQ accordion, 6–8 questions | shadcn `Accordion` | Feeds `FAQPage` JSON-LD (5.2) |
| 2.13 | Final CTA repeats the form | Reuse the hero form component | Same component, no copy |
| 2.14 | Footer: contact, WhatsApp, socials, legal links | `https://wa.me/<number>` link | Fires `whatsapp_clicked` |
| 2.15 | Section reveals | Framer Motion `whileInView`, `useReducedMotion` | Content visible with motion off |

**Phase 2 exit:** `impeccable detect --json app components`, fix the mechanical findings, then `/impeccable critique` on the landing page.

---

## Phase 3 — Free AI Visibility Check (Week 3)

Mode Operate for the progress, contact and result screens, inherited from the landing world. The sample's progress and result screens are the structural reference: per-engine rows with status, a progress bar with "x of 15 answers", a score ring, four stat tiles, top-3 competitors, and one quick fix. The rest of the report is shown locked.

**3.1 Data model (Supabase)**
- Tables: `leads` (contact, consent time, UTM, verified mobile), `checks` (domain, category, city, score, status, created_at), `answers` (engine, question, raw text, mentioned, position, competitors, cited URLs).
- **Ponytail:** Supabase JS client on the server only; SQL migration file; no ORM.

**3.2 Question builder**
- 5 templates × category + city, e.g. "best dental clinics in Pune".
- **Ponytail:** an array of template strings. One small test.

**3.3 Engine calls**
- OpenAI, Gemini, Perplexity called in parallel (`Promise.allSettled`), per-call timeout, 15 answers total, under 60 s.
- **Ponytail:** official SDKs or plain `fetch`; no AI framework or abstraction layer.
- **Never cut:** keys stay server-only (route handlers); a timeout returns a friendly retry, not an error page.

**3.4 Answer parsing and scoring**
- Per answer: mentioned? position? competitors? cited sites? Score = share of 15 mentioning the business, top-3 weighted higher.
- **Ponytail:** one pure function plus a test with fixture answers (new non-trivial logic gets a test).

**3.5 Progress screen**
- Stream per-engine progress to the client with a streamed route-handler response, or with a status endpoint polled every second (whichever is less code once 3.3 exists).
- **Ponytail:** no WebSocket server, no state library.
- **Done when:** a progress screen appears immediately on submit, with no layout shift.

**3.6 Contact step + OTP**
- Name, mobile, email, consent checkbox (store consent time). Send and verify OTP through the chosen DLT provider.
- **Never cut:** server-side Zod validation, OTP attempt limits.
- **Open decision:** provider (e.g. MSG91, 2Factor). Pick before this task starts.

**3.7 Abuse rules**
- Turnstile on the form, verified server-side. 3 attempts per IP per hour. One check per mobile and per domain per 30 days.
- **Ponytail:** Postgres queries over `checks`/`leads` for the 30-day rules; a Supabase table or Vercel KV for the IP counter. No new rate-limit service unless those can't do it.

**3.8 Result screen**
- Score /100, mentions x/15, top 3 competitors, one quick fix, the rest locked ("Our team will send your full report"). "Snapshot today" wording.
- Impeccable: `/impeccable harden` for loading, timeout, partial-engine and retry states.

**3.9 Webhook**
- POST lead + result JSON to `WEBHOOK_URL` on completion. Document the JSON shape in the README.
- **Ponytail:** one `fetch` after save; log failures and keep the row.

**3.10 Analytics**
- `check_started`, `otp_sent`, `lead_submitted`, `result_viewed`, `cta_clicked` (with location), `whatsapp_clicked`. `lead_submitted` goes to Meta as `Lead` via Pixel + Conversions API with a shared `event_id` for deduplication. UTM captured on landing and stored with the lead.
- **Ponytail:** `@next/third-parties` for GA4; one `track()` helper; plain Pixel/Clarity snippets via `next/script`.

---

## Phase 4 — Blog (Weeks 2–4)

Mode Read, inheriting the landing world's tokens.

**4.1 Content loader**
- `lib/content.ts` exposes `getPosts()` and `getPost(slug)`: the single swap point for a v2 CMS.
- **Ponytail:** `@next/mdx` or `next-mdx-remote` plus `gray-matter`; validate frontmatter with the existing Zod.

**4.2 `/blog`**
- Category filter and pagination, 9 per page, statically generated.
- **Ponytail:** search params + `generateStaticParams`; no client-side filtering lib.

**4.3 `/blog/[slug]`**
- Title, author with photo, dates, reading time, table of contents from headings, body, FAQ block, 3 related posts (same category), check CTA mid-post and at the end.
- **Ponytail:** reading time = words / 200; TOC from the MDX headings; related = same-category filter.

**4.4 Generated files**
- `app/sitemap.ts`, `app/robots.ts` (AI crawlers allowed), `app/rss.xml/route.ts`, `opengraph-image.tsx` per post, JSON-LD `Article`, `FAQPage`, `BreadcrumbList`.
- **Ponytail:** Next.js metadata file conventions; JSON-LD as a plain `<script type="application/ld+json">`.

**4.5 Posts**
- 1 sample post in Week 2; 5 launch posts in Week 4 using the `blog-post` skill (research steps, question H2s, sources, 1,000–2,000 words, human-edited).

---

## Phase 5 — SEO, legal, performance (Week 4)

**5.1** Per-page `metadata` (title, description, canonical, OG, Twitter). One H1 per page.
**5.2** JSON-LD `Organization` + `WebSite` on home, `FAQPage` from the FAQ content.
**5.3** `public/llms.txt` summarising who we are and the key pages.
**5.4** `/privacy`, `/terms` (DPDP Act: fields collected and why), custom `not-found.tsx`.
**5.5** Performance: `next/image` (AVIF/WebP, lazy below the fold), `next/font` with at most 2 families, no CLS from form or results, third-party scripts `afterInteractive`/`lazyOnload`.
- **Ponytail (whole phase):** platform features only; no SEO plugin.
- **Impeccable:** `/impeccable audit` (a11y, perf, responsive), then `/impeccable optimize` if LCP is over 2.5 s.

---

## Phase 6 — Impeccable finish (Week 4)

1. Batched screenshots at 390 px and 1440 px into `.impeccable/review/` (`mobile.png`, `desktop.png`), covering every check-flow state.
2. `impeccable detect --json` on the changed targets; fix the mechanical findings.
3. `/impeccable critique` then `/impeccable polish`.
4. Spawn `impeccable-finish-reviewer` with the request, the direction contract, the screenshots and the chosen comp. Act on its disposition (ship / fix / rebuild / recapture); at most two fix rounds.
5. Spawn `impeccable-documenter` to write `DESIGN.md` and `.impeccable/design.json` from the built site.
6. Final `/ponytail-review` over the whole diff.

The build is not finished until the review and `DESIGN.md` both exist.

---

## Environment variables (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=
OPENAI_API_KEY=
GEMINI_API_KEY=
PERPLEXITY_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SMS_OTP_API_KEY=
SMS_OTP_SENDER_ID=
SMS_OTP_TEMPLATE_ID=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
WEBHOOK_URL=
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_META_PIXEL_ID=
META_CAPI_TOKEN=
NEXT_PUBLIC_CLARITY_ID=
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

## Ownership

- **Intern A (design + frontend):** Phases 1, 2, 5.1–5.5, 6.
- **Intern B (check + blog + integrations):** Phases 0, 3, 4.
- Each reviews the other's PRs.

## Open decisions (resolve before the phase that needs them)

| Decision | Needed by |
| --- | --- |
| Final brand name from the shortlist | 1.7 |
| Visual direction (Impeccable round) and comp-first vs code-first | 1.5 |
| SMS OTP provider + DLT template | 3.6 |
| Webhook URL and its consumer | 3.9 |
| WhatsApp business number | 2.14 |

## Acceptance (from the PRD)

- [ ] Brand changes from `config/brand.ts` alone
- [ ] Check form visible without scrolling at 390 px
- [ ] Check result in under 60 s on mobile data
- [ ] 30-day mobile/domain limit enforced
- [ ] Webhook JSON documented and delivered
- [ ] Lighthouse mobile: performance 90+, accessibility 95+, SEO 100
- [ ] New post = one MDX file, with schema, OG image and sitemap entry generated
- [ ] All analytics events visible in GA4 and Meta Events Manager
- [ ] Privacy, terms, consent checkbox live
- [ ] README: setup, env vars, adding a post, skills used
- [ ] Impeccable finish review passed and `DESIGN.md` written
