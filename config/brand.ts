import { Hanken_Grotesk, Newsreader } from "next/font/google";

// Single source for name, logo, colours, fonts and feature flags. See .cursor/skills/brand-config.
// Values were read off design/Sample Dashboard.png. Contrast pairs checked: on-dark/dark, muted-on-dark/dark,
// on-cream/cream, muted-on-cream/cream, on-dark/accent-strong.

// Display serif with a true italic. Newsreader was picked over Source Serif 4 and Instrument Serif
// because its text weight and italic "recommend" match the reference headline most closely.
const display = Newsreader({
  variable: "--font-display-face",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Hanken_Grotesk({
  variable: "--font-body-face",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const brand = {
  name: "Citeo", // placeholder name, read it only from here
  legalName: "Citeo",
  tagline: "SEO and AEO for businesses that want to be found.",
  description:
    "We help businesses get found on Google and named by AI assistants like ChatGPT, Gemini and Perplexity.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  logo: { mark: "/brand/mark.svg" },
  // Each key becomes a CSS variable (--dark, --cream, --accent, ...) written to :root by app/layout.tsx.
  colors: {
    dark: "#0B0B14",
    "surface-dark": "#14141F",
    "line-dark": "rgb(255 255 255 / 0.1)",
    "on-dark": "#F4EFE6",
    "muted-on-dark": "#A8A3B8",
    cream: "#F4EFE6",
    "surface-cream": "#FFFFFF",
    "line-cream": "#E2DACB",
    "on-cream": "#14110F",
    "muted-on-cream": "#5E574F",
    accent: "#B79CF0",
    "accent-soft": "#E6DEF7",
    "accent-strong": "#2A2550",
    "cta-cream": "#F5E9CC",
    success: "#4CC38A",
    warning: "#E0A93B",
    danger: "#E5626B",
  },
  fonts: { display, body },
  features: {
    showCheckCount: false, // real count from the database; never hard-code a number
    showTestimonials: false, // only with real, approved quotes
    contactDuringProgress: true, // show the contact step while the check runs
  },
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  },
  // Empty strings are skipped in the footer; fill in once the handles exist.
  socials: { instagram: "", linkedin: "" },
} as const;

export type Brand = typeof brand;
