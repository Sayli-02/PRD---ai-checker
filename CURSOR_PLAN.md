# CURSOR_PLAN.md — Citeo (working name): AI Visibility Landing Page + Free Check

> Referenced from `AGENTS.md` and `.cursor/rules/cursor-plan.mdc` so every agent session reads it first.
> Visual source of truth: `/design/Sample Dashboard.png` (landing, progress, results frames). PRD: `/docs/PRD — AI Visibility Landing Page (Codename Project Cite).md`.
> **Source files (exact names):**
> - PRD: `/docs/PRD — AI Visibility Landing Page (Codename Project Cite).md`
> - Visual reference: `/design/Sample Dashboard.png`
> In Cursor, attach them with `@` mentions (paths contain spaces, so quote them in any terminal command).
> Work phase by phase. Do not start a phase until the previous phase's acceptance checks pass. One pull request per phase.

---

## 0. How Cursor must work on this repo

1. Read this file, `/docs/PRD — AI Visibility Landing Page (Codename Project Cite).md` and look at `/design/Sample Dashboard.png` before writing code.
2. Match the reference exactly for layout, spacing, radius, type and colour. When unsure, measure from the image rather than guessing.
3. Reuse before writing: use shadcn/ui primitives, native HTML, and Next.js built-ins (`next/image`, `next/font`, metadata API) before adding code or packages.
4. Never hard-code brand, copy or colours in components. They come from `/config/brand.ts`, `/content/*.ts` and CSS variables.
5. Never invent proof: no fake client logos, testimonials, or check counts. Anything unreal must be hidden behind a config flag.
6. No secrets in code. Everything via env vars, documented in `.env.example`.
7. Every PR: Lighthouse mobile screenshot, 390px screenshot, preview link, and no console errors.
8. Keep components small and typed. No `any`. Zod schemas are the single source of truth for API input and output.

---

## 1. Resolved decisions (do not re-debate)

| Topic | Decision |
|---|---|
| Product name | "Citeo" is a **placeholder**. Read it from `brand.name` only. |
| Framework | Next.js latest stable, App Router, TypeScript strict |
| Styling | Tailwind CSS + shadcn/ui, tokens as CSS variables |
| Theme | Build exactly as designed: **dark** hero/progress/results, **cream** body sections. Use semantic tokens so a light/dark toggle can be added later. No toggle in v1. |
| Accent | Lavender/indigo as in the reference. Flat colours; the only soft shape is the lavender blob behind the chat card. |
| Eyebrow above headline | Use plain text: `Free AI Visibility Check` (config-driven). Do not use the word "SEO" or "AEO" in the hero. |
| Engine names | **Text only** in the trust strip (ChatGPT, Gemini, Perplexity, Google). No official logos. Use neutral icons/monograms. |
| "checks run" counter | Real count from DB, behind `features.showCheckCount` (default `false`). Never hard-code a number. |
| Hero photo | Licensed/own image at `/public/images/hero.avif` (+ webp fallback). Do not crop it out of the reference PNG. A placeholder gradient-free dark image is fine until the real one arrives. |
| Prices / guarantees | None, anywhere. |
| Results wording | Always "a snapshot today". Never promise rankings. |
| Mobile | The reference is desktop only. Derive mobile at **390px first** (rules in §5). |

---

## 2. Design tokens (verify by eyedropping `/design/Sample Dashboard.png`, then lock)

Put in `app/globals.css` as CSS variables, mapped for Tailwind v4 via `@theme inline` (there is no `tailwind.config.ts` in this stack). Values below are best estimates; measure from the image when unsure.

```css
:root {
  /* dark surfaces */
  --bg-dark: #0B0B14;
  --surface-dark: #14141F;
  --border-dark: rgba(255,255,255,.10);
  --text-on-dark: #F4EFE6;
  --muted-on-dark: #A8A3B8;

  /* cream surfaces */
  --bg-cream: #F4EFE6;
  --surface-cream: #FFFFFF;
  --border-cream: #E2DACB;
  --text-on-cream: #14110F;
  --muted-on-cream: #5E574F;

  /* accent */
  --accent: #B79CF0;          /* italic word, gauge, progress */
  --accent-soft: #E6DEF7;     /* icon tiles, pill buttons */
  --accent-strong: #2A2550;   /* primary button */
  --cta-cream: #F5E9CC;       /* header CTA on dark */

  /* status */
  --success: #4CC38A;
  --warning: #E0A93B;
  --danger: #E5626B;

  --radius-card: 18px;
  --radius-control: 8px;
}
```

The live names in `config/brand.ts` / `:root` are kebab keys (`dark`, `surface-dark`, `on-dark`, …) written by `app/layout.tsx`. Do not duplicate hex values in components.

**Typography (max 2 families, via `next/font`):**
- Display: a serif with a true italic. Evaluate Newsreader, Source Serif 4, Instrument Serif by overlaying a screenshot of the hero headline on the reference; pick the closest and record the choice in `brand.ts`.
- UI/body: a clean grotesque (Hanken Grotesk or similar), 400–600.
- Eyebrows: uppercase, ~12px, letter-spacing ~0.14em, weight 600.
- Numbers (score, stats): tabular figures.
- Hero H1: ~64px desktop, ~36px at 390px, line-height ~1.05. The word "recommend." is an italic span in `--accent`.

**Icons:** `lucide-react` only (BarChart3, Users, Zap, MessageSquare, Link2, Layers, MapPin, Globe, Lock, ArrowRight, Check, ChevronDown).

---

## 3. Repo structure

```
/config/brand.ts             name, tagline, colours, fonts, logo paths, feature flags
/content/home.ts             ALL landing copy, FAQ, SEO vs AEO rows, how-we-work steps
/content/check.ts            categories list, question templates, score bands, error messages
/content/blog/*.mdx          posts
/design/Sample Dashboard.png        visual source of truth
/docs/PRD — AI Visibility Landing Page (Codename Project Cite).md
/app
  layout.tsx                 fonts, metadata, analytics scripts
  page.tsx                   landing
  check/[id]/page.tsx        progress -> contact -> result (state driven)
  blog/page.tsx, blog/[slug]/page.tsx
  privacy/page.tsx, terms/page.tsx, not-found.tsx
  sitemap.ts, robots.ts, rss.xml/route.ts, llms.txt/route.ts
  api/check/route.ts                  POST create job
  api/check/[id]/route.ts             GET status (+ gated result)
  api/check/[id]/lead/route.ts        POST contact details, sends OTP
  api/check/[id]/verify/route.ts      POST OTP verify, unlock result
/components
  ui/        Button, Input, Select, Card, Pill, Eyebrow, Accordion, Badge
  layout/    Header, Footer, Section
  home/      Hero, TrustStrip, ProblemMock, CheckShows, HowWeWork, SeoVsAeo,
             SampleReport, BlogPreview, Faq, FinalCta
  check/     CheckForm, EngineRow, ProgressBar, ContactStep, OtpInput,
             ScoreGauge, StatCard, CompetitorList, QuickFixCard, LockedReport
/lib
  env.ts (zod-validated env), supabase.ts, scoring.ts, questions.ts,
  engines/{openai,gemini,perplexity,types}.ts, rate-limit.ts, turnstile.ts,
  otp/{provider,msg91-or-chosen}.ts, webhook.ts, analytics.ts, blog.ts
/supabase/migrations/*.sql
.env.example
README.md
```

Blog content loading goes through **one function** in `/lib/blog.ts` so a CMS swap is easy later.

---

## 4. Phases

Each phase lists tasks, then acceptance checks. Tick boxes in the PR description.

### Phase 1 — Foundation (day 1–2)
- [ ] Init Next.js (App Router, TS strict, ESLint, Tailwind), add shadcn/ui, `lucide-react`, `framer-motion`, `react-hook-form`, `zod`, `@hookform/resolvers`.
- [ ] `/config/brand.ts` with name, tagline, colours, fonts, logo, `features: { showCheckCount: false, showTestimonials: false }`.
- [ ] `globals.css` tokens, Tailwind mapping, `next/font` for 2 families.
- [ ] Base UI components restyled to the reference: Button (primary indigo, cream CTA, soft lavender pill), Input with leading icon, Select with chevron, Card, Pill, Eyebrow, Accordion.
- [ ] Section wrapper supporting `tone="dark" | "cream"`.
- [ ] `lib/env.ts` validates env vars at startup. Commit `.env.example`.
- [ ] README setup in under 10 steps. Protect `main`, enable Vercel previews.

**Accept:** a `/styleguide` dev-only route shows every component in both tones; fonts load with no layout shift.

### Phase 2 — Header, Hero, Trust strip (day 2–4)
- [ ] `Header`: logo, links (How it works, Blog, FAQ), cream CTA "Check My Visibility" with arrow that scrolls to the form. Mobile: logo + CTA + menu button.
- [ ] `Hero` (dark): eyebrow, serif H1 with italic accent word, subhead, three value props (Higher visibility, More customers, Done for you) separated by hairlines, hero image right/behind with a CSS left-to-right dark overlay.
- [ ] `CheckForm` card (cream, 20px radius): serif title "Free AI Visibility Check", two-line description, inputs (website URL, business category select, city), indigo "Run Free Check →" button, footnote row ("Takes under 60 seconds", "No credit card needed").
- [ ] Form uses RHF + Zod. URL normalisation (add `https://`, strip path, lowercase host). Turnstile widget (invisible/managed) included but optional in dev.
- [ ] `TrustStrip` (cream): label "Analysed across", four engine names (text + neutral icon) separated by vertical rules, right block for count (hidden unless flag on).
- [ ] Hero image: `next/image`, `priority`, AVIF/WebP, correct `sizes`. This is the LCP element.

**Mobile rules (390px):** H1 ~36px; subhead one line; the **form must be fully visible on the first screen without scrolling**; value props move below the form; hero image becomes a faint background or is hidden; header CTA stays visible.

**Accept:** side-by-side screenshot vs reference at 1440px is visually matching; at 390px form is above the fold; LCP < 2.5s on mobile Lighthouse; no CLS.

### Phase 3 — Rest of the landing page (day 4–7)
- [ ] `ProblemMock` (cream): left column eyebrow "THE PROBLEM", serif H2 "AI tools are already recommending your competitors.", paragraph, lavender "See an example →" pill (scrolls to sample report). Right column: SVG lavender blob behind a white chat card with engine label, query pill "Best dental clinics in Pune?", intro line, numbered list of 3 competitors with circular index badges, `[1][2][3]` citation markers, and a **dashed empty slot "Your business"** as the missing 4th item.
- [ ] `CheckShows` ("WHAT THE CHECK SHOWS"): 4 columns divided by hairlines, lavender icon tile, bold title, short line (Mention rate, Competitors named, Sources AI trusts, Quick fixes). 4 cols desktop, 2x2 tablet, 1 col mobile.
- [ ] `HowWeWork`: 3 numbered steps (Audit, Optimise, Track monthly) + a clear line that our team does the work. Style it with the same tokens; do not use identical icon-circle cards.
- [ ] `SeoVsAeo`: plain two-column comparison table in simple words.
- [ ] `SampleReport`: blurred preview with a lock label (use CSS blur on **static placeholder content**, never real data).
- [ ] `Testimonials`: component exists, renders nothing unless `features.showTestimonials`.
- [ ] `BlogPreview`: latest 3 posts via `getLatestPosts(3)`.
- [ ] `Faq`: 6–8 items (what is AEO, how long results take, is the check free, what do you need from me, which AI engines, is my data safe) as an accessible accordion + `FAQPage` JSON-LD.
- [ ] `FinalCta` (dark): repeats `CheckForm`.
- [ ] `Footer`: contact, WhatsApp click-to-chat (`wa.me` link, tracked), social links, privacy, terms.
- [ ] Alternate dark/cream sections to match the reference rhythm. Framer Motion: gentle fade/translate reveals only; respect `prefers-reduced-motion`.

**Accept:** all copy comes from `/content/home.ts`; Lighthouse mobile perf >= 90, a11y >= 95; keyboard navigation works end to end.

### Phase 4 — Progress and Result screens with mock data (day 7–9)
Build with static fixtures first so visuals can be compared before any API exists.

**Progress screen** (dark):
- [ ] Header, centred eyebrow "AI VISIBILITY CHECK", serif "Running your check…", subline "We're asking ChatGPT, Gemini and Perplexity about your business."
- [ ] Three `EngineRow`s with `status: waiting | running | done | failed`: done = green check, running = spinner, waiting = empty ring, failed = warning + "Retry" button.
- [ ] `ProgressBar` (lavender) with left text "Processing 9 of 15 answers…" and right text "~28 seconds left". Bar = `answersDone / 15`. Add `aria-live="polite"` and `role="progressbar"` values.

**Contact step** (new, not in the reference; design it in the same dark-card style):
- [ ] Fields: name, mobile (+91 prefix, 10 digits), "Send OTP" button, OTP input (6 digits, `autocomplete="one-time-code"`, resend timer), email, consent checkbox ("I agree to be contacted by call and WhatsApp"), one line on why we ask, links to privacy and terms.
- [ ] Optionally shown **while** the progress runs to use the wait time (feature flag `contactDuringProgress`, default on).

**Result screen** (dark):
- [ ] Header with "Check Again" button.
- [ ] Left: eyebrow "YOUR RESULTS", serif "Your AI Visibility Score", sentence "Your business was mentioned in X of 15 AI answers."
- [ ] `ScoreGauge`: SVG ring, `stroke-dasharray` from score, serif number, "/ 100", overlapping band pill. Bands in `/content/check.ts`: Low < 40, Fair 40–69, Good 70–84, Strong 85+.
- [ ] Four `StatCard`s: answers mentioned (X / 15), competitors named instead, sources cited, quick fix count.
- [ ] Bottom row: `CompetitorList` (top 3, numbered) + tinted `QuickFixCard`.
- [ ] `LockedReport` strip: "Our team will send your full report." plus note "A snapshot today. AI answers change between runs."
- [ ] Empty/zero states: 0 mentions, fewer than 3 competitors, no sources.

**Mobile:** stats become 2x2, gauge above the title, competitor and quick-fix cards stack.

**Accept:** fixtures render all engine states and score bands; matches reference at 1440px; mobile screenshots attached.

### Phase 5 — Check engine (day 9–13)
**Question builder** (`lib/questions.ts`): from `category` + `city` generate 5 buyer-style queries, e.g. "best {category} in {city}", "top rated {category} near {city}", "which {category} in {city} should I choose", "affordable {category} in {city}", "{category} in {city} recommended by locals". Templates live in `/content/check.ts`.

**Engines** (`lib/engines/*`): common interface
```ts
interface EngineResult {
  engine: 'openai' | 'gemini' | 'perplexity';
  question: string;
  answerText: string;
  citations: string[];      // URLs if provided
  latencyMs: number;
  status: 'ok' | 'timeout' | 'error';
}
```
- 15 calls (5 x 3) in parallel with a **per-call timeout of ~25s**. One slow engine must not block the others.
- API keys server-side only.

**Analysis** (`lib/scoring.ts`), pure functions with unit tests:
- Mention detection: match on domain, brand name derived from the site title/domain, and common variants (case-insensitive, strip suffixes like "Pvt Ltd").
- Position: order of first appearance among extracted business names (numbered list items, bold names, or citation order). If position cannot be determined, treat as "mentioned, unranked".
- Competitors: extract named businesses from answers, normalise, count frequency, return top 3 not equal to the user's business.
- Sources: collect cited domains, count frequency.
- **Score:** for each of the 15 answers, weight = `1.0` if mentioned in position 1–3, `0.6` if mentioned elsewhere, `0` if not mentioned. `score = round(sum(weights) / 15 * 100)`. Also return `mentionedCount`.
- Quick fix: rule-based, chosen from a small library in `/content/check.ts` keyed by what is missing (e.g. no service pages cited, no local info). Never generated claims about rankings.
- Unit-test with saved fixture answers.

**Job flow:**
1. `POST /api/check` -> validate (Zod), verify Turnstile, IP rate limit (3/hour), check 30-day domain lock, create `checks` row `status=running`, return `{ id }`.
2. Run engine calls in the background (`after()` / `waitUntil`; set `export const maxDuration = 60` and confirm the Vercel plan limit). Update `answers_done` and per-engine status after each call.
3. `GET /api/check/[id]` returns progress `{ status, answersDone, engines:[{name,status}], etaSeconds }`. Client polls every 1.5s (SSE optional later).
4. On completion store raw answers and computed result.
5. Result is returned only after OTP verification (see Phase 6).

**Database (Supabase, migrations in `/supabase/migrations`):**
- `checks`: id, created_at, domain, category, city, status, answers_done, score, mentioned_count, result_json, ip_hash, utm_json, lead_id
- `check_answers`: id, check_id, engine, question, answer_text, citations_json, status, latency_ms
- `leads`: id, name, mobile (E.164), email, consent_at, consent_text, mobile_verified_at, utm_json, check_id
- `rate_limits` (or use Upstash/Vercel KV): key, window_start, count
- Unique constraints: verified mobile and domain once per 30 days (enforce in code **and** with a query-backed check).
- RLS on; server uses the service role key. Browser never talks to Supabase directly.

**Accept:** a full check finishes in under 60s on a normal connection; a timed-out engine shows `failed` with retry; unit tests pass; raw answers stored.

### Phase 6 — Lead capture, OTP, gating, webhook (day 13–15)
- [ ] `POST /api/check/[id]/lead`: validate name, mobile, email, consent. Store lead as unverified, send OTP via `lib/otp/provider.ts` (interface + one Indian DLT-registered provider implementation). In dev, a fixed OTP is allowed **only** when `NODE_ENV !== 'production'`.
- [ ] OTP rules: 6 digits, 5-minute expiry, max 5 attempts, resend cooldown 30s, hash OTPs at rest.
- [ ] `POST /api/check/[id]/verify`: on success set `mobile_verified_at`, enforce "one check per verified mobile per 30 days", unlock result.
- [ ] **Server-side gating:** `GET /api/check/[id]` includes score, competitors and quick fix **only** if the check's lead is verified. Never ship them to the browser and hide with CSS.
- [ ] Webhook (`lib/webhook.ts`): on verified completion POST JSON to `WEBHOOK_URL` with retries (3x, backoff) and a stored delivery status. Document the shape in README:
```json
{
  "event": "check.completed",
  "version": 1,
  "checkId": "uuid",
  "createdAt": "ISO-8601",
  "lead": { "name": "", "mobile": "+91...", "email": "", "consentAt": "ISO-8601", "mobileVerifiedAt": "ISO-8601" },
  "business": { "website": "https://...", "domain": "", "category": "", "city": "" },
  "result": {
    "score": 72,
    "band": "Good",
    "mentionedCount": 11,
    "totalAnswers": 15,
    "competitors": [{ "name": "", "mentions": 0 }],
    "topSources": [{ "domain": "", "count": 0 }],
    "quickFix": ""
  },
  "rawAnswersRef": "check_answers rows for checkId",
  "utm": { "source": "", "medium": "", "campaign": "", "term": "", "content": "" },
  "meta": { "ipHash": "", "userAgent": "" }
}
```
- [ ] Error states with friendly copy and designs: engine timeout (retry), rate limited, "already checked in the last 30 days", OTP wrong/expired, Turnstile failed.

**Accept:** same mobile or domain cannot run a second check within 30 days; result never present in network responses before verification; webhook delivered and logged.

### Phase 7 — Blog (day 15–18)
- [ ] MDX posts in `/content/blog/` with frontmatter: `title, slug, description (<160 chars), date, updated, author, category, tags, coverImage, faq[]`. Validate with Zod at build time; fail the build on bad frontmatter.
- [ ] `/blog`: category filter, 9 per page, pagination, static generation. `/blog/[slug]`: title, author + photo, published/updated dates, reading time, table of contents, body, FAQ block, 3 related posts, check CTA mid-post and at end.
- [ ] Generate: `sitemap.xml`, RSS, per-post Open Graph image, JSON-LD (`Article`, `FAQPage`, `BreadcrumbList`).
- [ ] Style with the same tokens (cream reading surface, serif headings).
- [ ] Add 1 sample post now; 5 launch posts in week 4.

### Phase 8 — SEO, analytics, legal, polish (day 18–20)
- [ ] Unique title/description per page, Open Graph + Twitter cards, canonical tags, one H1 per page.
- [ ] JSON-LD: `Organization` + `WebSite` on home, `FAQPage` on FAQ.
- [ ] `robots.txt` allows AI crawlers. `llms.txt` route summarising who we are and key pages.
- [ ] Analytics (GA4, Meta Pixel + Conversions API, Microsoft Clarity), loaded with `next/script` (`afterInteractive`/`lazyOnload`) so LCP is unaffected. Events: `check_started`, `otp_sent`, `lead_submitted`, `result_viewed`, `cta_clicked` (with location), `whatsapp_clicked`. Send `lead_submitted` as Meta `Lead` via Pixel **and** CAPI with a shared `event_id` for dedupe. Capture UTMs on first load, persist in a cookie, store with the lead.
- [ ] `/privacy` and `/terms` pages, consent timestamp stored, only listed fields collected with reasons (India DPDP Act).
- [ ] Accessibility pass: labels on every input, visible focus, WCAG AA contrast (check lavender on dark and muted text over the hero image), reduced-motion.
- [ ] Custom 404.
- [ ] Final Lighthouse: mobile perf >= 90, a11y >= 95, SEO 100, LCP < 2.5s.

---

## 5. Responsive rules (reference is desktop-only)

| Section | 390px behaviour |
|---|---|
| Header | Logo + cream CTA + menu button; links in a sheet |
| Hero | Headline ~36px, one-line subhead, form directly below and fully visible without scroll, value props below form, image faint or hidden |
| Trust strip | Wrapping row, count on its own line |
| Problem | Text first, chat card below; blob scaled down |
| What check shows | 1 column with hairline dividers |
| Progress | Same layout, full width rows |
| Result | Gauge on top, stat cards 2x2, list and fix cards stacked |

Design with fluid type (`clamp()`) and test at 360, 390, 768, 1024, 1440.

---

## 6. Environment variables (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_CLARITY_ID=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
PERPLEXITY_API_KEY=
OTP_PROVIDER_KEY=
OTP_SENDER_ID=
OTP_DLT_TEMPLATE_ID=
META_CAPI_TOKEN=
WEBHOOK_URL=
IP_HASH_SALT=
```

---

## 7. QA and definition of done

- [ ] Visual diff against `/design/Sample Dashboard.png` for each frame (Playwright screenshots at 1440px; compare spacing, size, radius, colour).
- [ ] Brand name, logo, colours and fonts change from `/config/brand.ts` alone.
- [ ] Check form visible without scrolling at 390px.
- [ ] Check returns a result in under 60s on mobile data.
- [ ] Same mobile or domain blocked for 30 days.
- [ ] Result data absent from network responses until OTP verified.
- [ ] Webhook receives documented JSON.
- [ ] All six analytics events visible in GA4 and Meta Events Manager; Meta events deduplicated.
- [ ] New blog post = one MDX file; schema, OG image and sitemap entry auto-generated.
- [ ] Privacy, terms and consent checkbox live.
- [ ] No fake logos, testimonials, counts, prices or guarantees anywhere.
- [ ] README covers setup (<10 steps), env vars, adding a blog post, webhook shape.

## 8. Risks to watch

- **LCP:** hero image is the main risk. Compress hard, responsive `sizes`, overlay in CSS.
- **Serverless time limit:** run checks as a background job with polling, not one long request.
- **Engine variance:** AI answers change between runs; label results as a snapshot and never claim rankings.
- **Name extraction accuracy:** competitor/position parsing from free text is imperfect. Keep it conservative, unit-test with real fixtures, and log unparseable answers for review.
- **Trademark/logo use:** engine names as text only until legal says otherwise.

---

## 9. Prompts to paste into Cursor (one per phase)

**Kickoff**
> Read `CURSOR_PLAN.md`, `/docs/PRD — AI Visibility Landing Page (Codename Project Cite).md` and `/design/Sample Dashboard.png`. Do Phase 1 only. Create the project structure from section 3, tokens from section 2, and base UI components. Stop and summarise what you built and any deviations.

**Phase 2**
> Do Phase 2 from `CURSOR_PLAN.md`. Build Header, Hero, CheckForm and TrustStrip to match the landing frame in `/design/Sample Dashboard.png`. Copy lives in `/content/home.ts`. Apply the 390px rules from section 5. Show the form above the fold on mobile.

**Phase 3**
> Do Phase 3. Build ProblemMock (include the dashed "Your business" missing slot), CheckShows, and the remaining sections, extending the same tokens. Hide Testimonials via the feature flag.

**Phase 4**
> Do Phase 4 using static fixtures only. Build the progress screen, contact step and result screen, including ScoreGauge and all EngineRow states. Match the reference frames and derive mobile layouts.

**Phase 5**
> Do Phase 5. Implement question builder, three engine clients with 25s timeouts, scoring with unit tests, the Supabase migrations, and the `/api/check` endpoints with Turnstile and rate limiting. Poll-based progress.

**Phase 6**
> Do Phase 6. Implement lead capture, OTP provider interface, verification, server-side result gating, the 30-day locks, and the webhook with the documented JSON shape.

**Phase 7 and 8**
> Do Phase 7, then Phase 8. Blog system from MDX, schema, sitemap, RSS, OG images, analytics events with Meta dedupe, legal pages, accessibility and Lighthouse fixes.

**Before every PR**
> Run lint, type-check, tests and Lighthouse mobile. Take 390px and 1440px screenshots, compare against the reference, list any deviations, and confirm no secrets or invented proof.
