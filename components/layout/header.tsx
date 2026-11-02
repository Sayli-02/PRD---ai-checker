"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { home } from "@/content/home";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Dark strip. Below md the links fold into a menu; the cream CTA always stays visible.
// `ctaHref` lets inner pages send the CTA to the form on the home page.
export function Header({
  ctaHref = "#check",
  ctaLabel = home.nav.cta,
  sticky = true,
}: {
  ctaHref?: string;
  ctaLabel?: string;
  sticky?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header data-tone="dark" className={cn("z-40 border-b border-tone-line", sticky && "sticky top-0")}>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link href="/" aria-label="Home" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {home.nav.links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-tone-fg hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={ctaHref}
            onClick={() => {
              track("cta_clicked", { location: "header" });
              setOpen(false);
            }}
            className={cn(buttonVariants({ variant: "cream", size: "sm" }), "rounded-full")}
          >
            {ctaLabel}
            <ArrowRight aria-hidden />
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-control border border-tone-line md:hidden"
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-tone-line bg-surface-dark md:hidden">
          <ul className="mx-auto max-w-6xl divide-y divide-line-dark px-5">
            {home.nav.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="block py-3.5 text-lg font-medium">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
