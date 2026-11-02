"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";

// Mid-post and end-of-post call to action. Sends the reader to the form on the home page.
export function CheckCta({ location }: { location: "post_mid" | "post_end" }) {
  return (
    <aside className="my-10 rounded-card bg-dark p-5 text-on-dark sm:p-6">
      <p className="font-serif text-3xl leading-tight">Is AI naming your business?</p>
      <p className="mt-2 text-muted-on-dark">Run the free AI Visibility Check. It takes under 60 seconds.</p>
      <Link
        href="/#check"
        onClick={() => track("cta_clicked", { location })}
        className="mt-4 inline-flex h-12 items-center gap-2 rounded-control bg-cta-cream px-5 font-semibold text-on-cream hover:bg-cta-cream/90"
      >
        Run free check
        <ArrowRight aria-hidden className="size-5" />
      </Link>
    </aside>
  );
}
