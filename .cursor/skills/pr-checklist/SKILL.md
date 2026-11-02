---
name: pr-checklist
description: Checklist to run before opening or approving a pull request. Use when preparing a PR, reviewing a teammate's PR, or when asked whether a change is ready to merge.
---

# PR checklist

`main` is protected. Every change goes through a pull request with its Vercel preview link.

Before opening the PR:

- [ ] `/ponytail-review` run on the diff; findings fixed or noted
- [ ] `npm run lint` and `npm run build` pass
- [ ] Lighthouse mobile on the preview link: performance 90+, accessibility 95+, SEO 100; LCP under 2.5 s
- [ ] Mobile screenshot at 390 px attached (and 1440 px for layout changes)
- [ ] UI changes: `impeccable detect --json` run on the changed files, mechanical findings fixed
- [ ] No secrets in the diff; any new variable added to `.env.example` and the README
- [ ] Copy follows `copy-rules`; brand values come from `config/brand.ts`
- [ ] New or changed behaviour has its test; check-flow changes follow `visibility-check`
- [ ] Preview link in the PR description

Reviewer (the other intern) checks the same list and opens the preview on a phone-sized viewport.
