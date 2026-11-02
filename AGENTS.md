## Read first

Read `CURSOR_PLAN.md` (the build plan, phases and rules) and `docs/PRD — AI Visibility Landing Page (Codename Project Cite).md` before any change. The visual source of truth is `design/Sample Dashboard.png`. Work phase by phase; do not start a phase until the previous phase's acceptance checks pass. One pull request per phase. The always-on rule is `.cursor/rules/cursor-plan.mdc`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
