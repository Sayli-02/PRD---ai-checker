---
name: brand-config
description: Where the brand name, logo, colours and fonts live and how to swap them. Use when touching the brand name, logo, colour tokens, fonts, favicon or OG image, or when any component needs a brand value.
---

# Brand config

All brand values live in `config/brand.ts`. Components never hardcode a name, hex, font or logo path.

## Shape

```ts
export const brand = {
  name: "Citeo", // placeholder until the founder picks
  tagline: "",
  logo: { mark: "/brand/mark.svg" },
  colors: { /* dark / cream / accent hex values from Sample Dashboard.png */ },
  fonts: { display: Newsreader, body: Hanken_Grotesk },
  features: { showCheckCount: false, showTestimonials: false, contactDuringProgress: true },
  url: process.env.NEXT_PUBLIC_SITE_URL,
};
```

## Rules

- Tailwind theme reads from `brand.colors` via `:root` variables written by `app/layout.tsx`. Never duplicate a hex in CSS or in a component.
- Fonts load through `next/font`, at most 2 families (display serif + body grotesque).
- A component that needs the name or logo imports `brand`; copy that mentions the name uses `brand.name`.
- Favicon, Apple icon and OG image use Next.js file conventions in `app/`.

## Swapping the brand

1. Edit `config/brand.ts`.
2. Replace the files in `public/brand/` and regenerate `app/icon.tsx`, `app/apple-icon.tsx`, `app/opengraph-image.tsx` if the mark changed.
3. Check: `rg -i "<old name>"` returns nothing outside `content/blog/` and git history.

Done when changing `brand.ts` and those assets alone changes the name, logo, colours and fonts everywhere.
