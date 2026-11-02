"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";

// Station-board strip. Below md the three links fold into a menu; the CTA always stays visible.
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="on-board sticky top-0 z-40 border-b border-board-line bg-board text-on-board">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link href="/" aria-label="Home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {site.nav.links.map((l) => (
            <Link key={l.href} href={l.href} className="font-medium hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#check"
            onClick={() => track("cta_clicked", { location: "header" })}
            className="inline-flex h-10 items-center rounded-md bg-signal px-3.5 text-sm font-semibold text-on-signal hover:bg-signal/90 sm:px-4"
          >
            {site.nav.cta}
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-md border border-board-line md:hidden"
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Main" className="border-t border-board-line bg-board-deep md:hidden">
          <ul className="mx-auto max-w-6xl divide-y divide-board-line px-5">
            {site.nav.links.map((l) => (
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
