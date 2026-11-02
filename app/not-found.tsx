import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8">
        <h1 className="text-5xl font-bold sm:text-6xl">We could not find that page.</h1>
        <p className="mt-4 text-lg text-ink-muted">It may have moved. Try one of these instead.</p>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-lg font-semibold">
          <Link href="/" className="underline">
            Home and free check
          </Link>
          <Link href="/blog" className="underline">
            Blog
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
