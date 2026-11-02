import { Barlow_Semi_Condensed, Hind } from "next/font/google";

// Single source for name, logo, colours and fonts. See .cursor/skills/brand-config.
// Contrast is checked against these pairs: on-board/board, ink/paper, signal/on-signal.

const heading = Barlow_Semi_Condensed({
  variable: "--font-heading-face",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const body = Hind({
  variable: "--font-body-face",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const brand = {
  name: "Citara", // working name until the founder picks from the shortlist
  legalName: "Citara",
  description:
    "We help businesses get found on Google and named by AI assistants like ChatGPT, Gemini and Perplexity.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  logo: { mark: "/brand/mark.svg" },
  // Each key becomes a CSS variable (--board, --paper, ...) in app/layout.tsx.
  colors: {
    board: "#0B2A5B",
    "board-deep": "#071B3D",
    "board-line": "#2C4B82",
    "on-board": "#F4F7FB",
    "on-board-muted": "#B8C6DE",
    paper: "#EEF1F5",
    "paper-deep": "#E1E6ED",
    slip: "#FBFCFE",
    ink: "#0E1726",
    "ink-muted": "#4A5568",
    rule: "#B9C2D0",
    signal: "#FFB400",
    "on-signal": "#0B2A5B",
    missing: "#B3102B",
    "missing-on-board": "#FF7A8A",
    confirmed: "#1B7A46",
    "confirmed-on-board": "#5BD18A",
  },
  fonts: { heading, body },
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  },
  // Empty strings are skipped in the footer; fill in once the handles exist.
  socials: { instagram: "", linkedin: "" },
} as const;

export type Brand = typeof brand;
