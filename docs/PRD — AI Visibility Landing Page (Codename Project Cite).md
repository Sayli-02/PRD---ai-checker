# PRD — Landing Page for an AI Search Visibility Agency

Oct 27, 2026 · @gautam

Interns will design and build a high-converting, mobile-first landing page and blog in Next.js for a new agency that helps businesses get found on Google and recommended by AI assistants like ChatGPT, Gemini and Perplexity.

## Goal

The page has one job: turn a visitor into a lead by getting them to run a free AI Visibility Check and leave their contact details.

**What the agency does (for context in copy):** SEO (ranking on Google) and AEO, Answer Engine Optimisation (getting a business mentioned and cited inside AI answers). Our team does the work for the client; the client never has to do SEO themselves.

**Primary visitor:** a business owner or marketing head in India, arriving on a phone from an Instagram or Facebook ad, with about 5 seconds of attention.

### How we judge the page

| Measure | Target |
| --- | --- |
| Visitors who start the free check | 25% or more |
| Starters who submit contact details | 50% or more |
| Mobile Lighthouse performance score | 90 or more |
| Largest Contentful Paint on mobile | Under 2.5 seconds |
| Accessibility score (Lighthouse) | 95 or more |

The codebase must be ready to grow into a full product later (client login, dashboard), which is why Next.js is the framework.

## Brand: name and logo

Interns propose the name and design the logo; the final pick is made by the founder from a shortlist of 5.

### Name

- Short: 1–2 words, under 10 letters, easy to say on a phone call in English and Hindi.
- Signals visibility, answers or being found (for example the ideas of "cite", "signal", "beacon", "answer"), without using "SEO" in the name.
- Not tied to India only, so it can serve overseas clients later.
- For each of the 5 shortlisted names, check and record: `.com` and `.in` domain availability, Instagram and LinkedIn handle availability, and a trademark search on the IP India public search.
- Deliverable: a one-page sheet with 5 names, a one-line meaning for each, and the availability checks.

### Logo

- A wordmark plus a simple icon that works alone at 32 × 32 px (favicon, app icon, profile picture).
- Must read clearly in one colour, on light and on dark backgrounds.
- Avoid clichés: magnifying glasses, rockets, generic AI sparkles, purple gradients.
- Deliver as SVG (master), PNG at 512 px and 1024 px, favicon set, and an Open Graph image (1200 × 630).
- Include a mini brand sheet: primary and secondary colours (hex), two fonts (one heading, one body), logo clear-space rule.

**Build rule:** name, logo, colours and fonts live in one config file (`/config/brand.ts`) so the brand can change without touching components.

## Page sections

One long-scroll page, built mobile-first at 390 px width; the check form must be visible on the first screen without scrolling.

| # | Section | Purpose | Must contain |
| --- | --- | --- | --- |
| 1 | Header | Navigation | Logo, links (How it works, Blog, FAQ), one CTA button that scrolls to the check |
| 2 | Hero | Hook + start the check | Headline on the problem (customers now ask AI, not only Google), one-line subhead, check form |
| 3 | Trust strip | Credibility | Names of AI engines covered (text, not their logos), later client logos and number of checks run |
| 4 | The problem | Make the pain visible | A designed mock of an AI answer recommending competitors while the visitor's business is missing |
| 5 | What the check shows | Explain the free value | 3–4 cards: mention rate, competitors named instead, sources AI trusts, quick fixes |
| 6 | How we work | Show it's done for you | 3 steps: audit, optimise, track monthly; clear that our team does the work |
| 7 | SEO vs AEO | Educate | Simple two-column comparison, plain words |
| 8 | Sample report | Curiosity | Blurred preview of a full report |
| 9 | Testimonials | Social proof | Placeholder component, hidden until real testimonials exist; never fake ones |
| 10 | Latest blog posts | Authority + SEO | 3 most recent posts, auto-pulled |
| 11 | FAQ | Remove doubt | 6–8 questions as an accordion (what is AEO, how long results take, is the check free, what do you need from me) |
| 12 | Final CTA | Second chance | Repeat the check form |
| 13 | Footer | Trust + legal | Contact, WhatsApp click-to-chat, social links, privacy policy, terms |

Extra pages: `/blog`, `/blog/[slug]`, `/privacy`, `/terms`, a custom 404.

**Copy rules:** short sentences, no jargon above the fold, Indian English, no prices on the page, no guaranteed results. All copy lives in one content file so it can be edited without touching components.

## Free AI Visibility Check

The check is the conversion engine: a visitor enters their business, sees a live progress screen, and unlocks a teaser score after giving contact details.

### User flow

1. Visitor enters website URL, business category (dropdown) and city.
2. A progress screen appears at once ("Asking ChatGPT… Gemini… Perplexity…") so they don't leave.
3. Contact step: name, mobile, email, consent checkbox. Mobile is verified by OTP.
4. Result page: visibility score out of 100, how many AI answers mentioned them, top 3 competitors named instead, and one quick fix. The rest is shown as locked: "Our team will send your full report."

### How it works

- Build 5 buyer-style questions from category + city (for example "best dental clinics in Pune").
- Ask each question to OpenAI, Gemini and Perplexity through their APIs (15 answers in total).
- Check each answer: is the business mentioned, at what position, which competitors appear, which websites are cited.
- Score = share of the 15 answers that mention the business, weighted higher for a top-3 position.
- Save every raw answer with the lead.

### Rules

- One check per verified mobile and one per domain every 30 days.
- Bot protection on the form (Cloudflare Turnstile) and an IP rate limit of 3 attempts per hour.
- Must finish in under 60 seconds; show a friendly retry if an engine times out.
- API keys only on the server, never in browser code.
- Wording: results are "a snapshot today"; AI answers change between runs, so never promise rankings.

### Output

When a check completes, send the lead and its result as JSON to a webhook URL (provided later via an environment variable). Interns define the JSON shape and document it in the README.

## Blog

The blog is our own proof that we can rank and get cited, so every post must be written and structured the way we would do it for a client.

### How posts are added (version 1)

- Each post is an MDX file in `/content/blog/` — adding a post = adding one file and opening a pull request. No database needed.
- Every file starts with frontmatter: `title`, `slug`, `description` (under 160 characters), `date`, `updated`, `author`, `category`, `tags`, `coverImage`, `faq` (list of question/answer pairs).
- Pages: `/blog` (list with category filter and pagination, 9 per page) and `/blog/[slug]`, both statically generated.
- Each post page shows: title, author with photo, published and updated dates, reading time, table of contents, body, FAQ block, 3 related posts, and the check CTA mid-post and at the end.
- Auto-generate: `sitemap.xml`, RSS feed, Open Graph image per post, and JSON-LD schema (`Article`, `FAQPage`, `BreadcrumbList`).
- Later (version 2): move to a headless CMS so non-developers can publish. Keep content loading behind one function so the swap is easy.

### How to research a blog topic

1. **Collect real questions:** Google's "People also ask", autocomplete, Google Search Console queries (once the site is live), Reddit and Quora threads, and Google Trends for India.
2. **Check the AI answer:** ask ChatGPT, Gemini and Perplexity the question; note who they cite and what is missing.
3. **Check competitors:** read the top 5 Google results; plan a post that answers better and more specifically.
4. **Pick a primary question and 3–5 related ones** for the FAQ.
5. **Write a one-page brief** before drafting: target question, audience, outline, sources, internal links.

### How every post is written

- Answer the main question in the first 2–3 sentences, then go deeper.
- Question-style H2 headings, short paragraphs, at least one table or list.
- Real numbers with linked sources; no copied text.
- AI can help draft, but a human edits every post and fact-checks every number.
- 1,000–2,000 words; 2–3 internal links, 1–3 external links to credible sources.

Launch with 5 posts on core topics such as "What is AEO?", "SEO vs AEO", and "How to get your business recommended by ChatGPT".

## Tech stack

Use Next.js (App Router) with TypeScript. Plain React (Vite) is allowed only if Next.js blocks something, and the reason must be written in the README, because the product will be extended on Next.js.

| Layer | Choice | Used for |
| --- | --- | --- |
| Framework | Next.js (latest stable, App Router) + TypeScript | Pages, blog, server routes for the check |
| Styling | Tailwind CSS + shadcn/ui | Components and design tokens |
| Animation | Framer Motion (sparingly) | Section reveals, progress screen; respect reduced-motion |
| Blog content | MDX files + frontmatter | Posts in the repo |
| Forms | React Hook Form + Zod | Validation on client and server |
| Database | Supabase (Postgres) | Store leads, check results, raw AI answers |
| AI engines | OpenAI, Google Gemini, Perplexity APIs | Run the visibility check |
| OTP | An Indian SMS OTP provider with DLT registration | Verify mobile numbers |
| Bot protection | Cloudflare Turnstile | Stop fake submissions |
| Analytics | Google Analytics 4, Meta Pixel + Conversions API, Microsoft Clarity | Funnel tracking and session recordings |
| Hosting | Vercel | Deploys and a preview link per pull request |
| Editor | Cursor (with the skills below) | Day-to-day building |

**Repo rules:** one GitHub repo; `main` is protected; every change goes through a pull request with its preview link; secrets only in environment variables with a `.env.example` file committed; README explains setup in under 10 steps.

## Skills to install in Cursor

Cursor supports Agent Skills natively and reads SKILL.md folders from `.cursor/skills/`, `.claude/skills/` and `.agents/skills/` at the project root, so skills built for Claude Code work in Cursor too ([Cursor docs](https://cursor.com/docs/skills)). Commit project skills to the repo so both interns' agents follow the same rules.

### Skills to install

| Skill | What it does | When to use | How to install |
| --- | --- | --- | --- |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Design knowledge base: UI styles, colour palettes, font pairings and UX rules, chosen by industry | First: generate the design system (colours, type, layout) for the page | `npm install -g uipro-cli`, then `uipro init --ai cursor` (needs Python 3) |
| [Impeccable](https://github.com/pbakaus/impeccable) | Builds on Anthropic's frontend-design skill with design references, anti-patterns and commands such as `/critique` | Second: build, critique and polish every section; run `/teach-impeccable` once to give it the brand context | Follow the repo's Cursor install steps |
| [Ponytail](https://github.com/DietrichGebert/ponytail) | Makes the agent reuse existing code and native platform features before writing new code | Always on while coding; `/ponytail-review` before each pull request | Cursor: add its rule file at `.cursor/rules/ponytail.mdc` per the repo |
| [frontend-design](https://github.com/anthropics/skills) (Anthropic) | Commits to a clear aesthetic direction before coding | Only if Impeccable is not installed; Impeccable already includes it | Copy the skill folder into `.cursor/skills/` |
| Vercel web design guidelines | A curated set of web design and accessibility best practices | Final review pass before launch | Install from Vercel's agent-skills repo; vet first |

**Avoid conflicts:** UI UX Pro Max sets the design system; Impeccable refines it. Don't ask both to design from scratch in the same prompt, or they will pull in different directions.

### Custom skills the interns write (day 1–2)

Use Cursor's built-in `/create-skill` command. Save each in `.cursor/skills/`.

- `brand-config` — where name, logo, colours and fonts live and how to swap them.
- `copy-rules` — tone, banned words, Indian English, no prices, no guarantees.
- `blog-post` — the frontmatter fields, post structure and research steps from the Blog section.
- `visibility-check` — question templates, scoring formula, JSON output shape, time and rate limits.
- `pr-checklist` — Lighthouse scores, mobile screenshot, no secrets, preview link attached.

**Safety:** read every third-party SKILL.md and its scripts before installing; never install a skill that asks for API keys or runs unknown scripts.

## Performance, SEO and analytics

We sell visibility, so our own site must pass every check we would run on a client's site.

### Performance and accessibility

- Images through `next/image`, in AVIF or WebP, lazy-loaded below the fold.
- Fonts through `next/font`, at most 2 families.
- No layout shift when the check form or results load.
- Keyboard-usable form, visible focus states, labels on every input, contrast at WCAG AA.

### SEO and AEO on our own site

- Unique title and meta description per page; Open Graph and Twitter cards.
- JSON-LD: `Organization` and `WebSite` on the home page, `FAQPage` for the FAQ, `Article` on posts.
- `sitemap.xml` and `robots.txt` generated automatically; AI crawlers are allowed.
- An `llms.txt` file at the root summarising who we are and our key pages.
- Clean URLs, one H1 per page, logical heading order, canonical tags.

### Analytics events

| Event | Fires when |
| --- | --- |
| `check_started` | The URL form is submitted |
| `otp_sent` | An OTP is requested |
| `lead_submitted` | OTP is verified and contact details saved |
| `result_viewed` | The result page is shown |
| `cta_clicked` | Any CTA button is clicked (with its location) |
| `whatsapp_clicked` | Click-to-chat is used |

Send `lead_submitted` to Meta as the `Lead` event through both the Pixel and the Conversions API, deduplicated. Capture UTM parameters and store them with each lead.

### Legal

- Privacy policy and terms pages live before launch.
- Consent checkbox for calls and WhatsApp messages; store the consent time.
- Collect only the fields listed and say why, in line with India's Digital Personal Data Protection Act.

## Deliverables, timeline and acceptance

Four weeks from kickoff to a live page, with a review at the end of each week.

| Week | Deliverables |
| --- | --- |
| 1 | 5 name options with availability checks; 2–3 logo directions; brand sheet; design system from UI UX Pro Max; mobile wireframes of all sections; repo, skills and Vercel set up |
| 2 | Final logo files; all page sections built and responsive; content file for copy; blog pages with 1 sample post |
| 3 | Free check working end to end (form, progress, OTP, result, webhook); bot protection and rate limits; analytics events |
| 4 | 5 launch blog posts; SEO and schema; legal pages; Lighthouse fixes; Impeccable `/critique` pass; launch |

Split the work so one intern leads design and frontend and the other leads the check, blog system and integrations; both review each other's pull requests.

### Acceptance checklist

- [ ] Brand name, logo, colours and fonts change from `/config/brand.ts` alone
- [ ] Check form visible without scrolling on a 390 px screen
- [ ] Free check returns a result in under 60 seconds on mobile data
- [ ] Same mobile or domain cannot run a second check within 30 days
- [ ] Lead and result reach the webhook as documented JSON
- [ ] Lighthouse mobile: performance 90+, accessibility 95+, SEO 100
- [ ] New blog post published by adding one MDX file, with schema, OG image and sitemap entry generated
- [ ] All analytics events visible in GA4 and Meta Events Manager
- [ ] Privacy policy, terms and consent checkbox live
- [ ] README covers setup, environment variables, adding a blog post, and the skills used

## Sources

- [Cursor — Agent Skills documentation](https://cursor.com/docs/skills)
- [UI UX Pro Max — Cursor setup](https://www.mintlify.com/nextlevelbuilder/ui-ux-pro-max-skill/platforms/cursor)
- [UI UX Pro Max — installation](https://www.mintlify.com/nextlevelbuilder/ui-ux-pro-max-skill/installation)
- [Impeccable — introduction](https://www.mintlify.com/pbakaus/impeccable/introduction)
- [Ponytail — guide](https://skillselion.com/guides/ponytail-skill-claude-code-guide)
- [Ponytail — install in other agents including Cursor](https://horadecodar.com.br/ponytail-claude-code/)
- [Must-have UX/UI design skills (mentions Vercel's guidelines skill)](https://uxplanet.org/must-have-ux-ui-design-skills-for-claude-code-364e93e3a614)
