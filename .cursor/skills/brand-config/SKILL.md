---
name: brand-config
description: Where the brand name, logo, colours and fonts live and how to swap them. Use when touching the brand name, logo, colour tokens, fonts, favicon or OG image, or when any component needs a brand value.
---

# Brand config

All brand values live in `config/brand.ts`. Components never hardcode a name, hex, font or logo path.

## Shape

```ts
export const brand = {
  name: "Citara",            // working name until the founder picks
  tagline: "",
  logo: { mark: "/brand/mark.svg", wordmark: "/brand/wordmark.svg" },
  colors: { /* hex values, light + dark, from the locked Impeccable direction */ },
  fonts: { heading: "<next/font import>", body: "<next/font import>" },
  url: process.env.NEXT_PUBLIC_SITE_URL,
};
```

## Rules

- Tailwind theme and shadcn CSS variables read from `brand.colors`; never duplicate a hex in CSS.
- Fonts load through `next/font`, at most 2 families (one heading, one body).
- A component that needs the name or logo imports `brand`; copy that mentions the name uses `brand.name`.
- Favicon, Apple icon and OG image use Next.js file conventions in `app/` (`icon.svg`, `apple-icon.png`, `opengraph-image.png`).

## Swapping the brand

1. Edit `config/brand.ts`.
2. Replace the files in `public/brand/` and `app/icon.svg`, `app/apple-icon.png`, `app/opengraph-image.png`.
3. Check: `rg -i "<old name>"` returns nothing outside `content/blog/` and git history.

Done when changing `brand.ts` and those assets alone changes the name, logo, colours and fonts everywhere.
