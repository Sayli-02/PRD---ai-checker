import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { CheckFlow } from "@/components/check/check-flow";

export const metadata: Metadata = {
  title: "Your AI Visibility Check",
  robots: { index: false, follow: false },
  alternates: { canonical: "/check" },
};

export default function CheckPage() {
  return (
    <div className="on-board min-h-dvh bg-board text-on-board">
      <header className="border-b border-board-line">
        <div className="mx-auto flex h-16 max-w-xl items-center px-5">
          <Link href="/" aria-label="Home">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-xl px-5 py-10">
        <Suspense fallback={<p className="text-on-board-muted">Loading your check…</p>}>
          <CheckFlow />
        </Suspense>
      </main>
    </div>
  );
}
