import { Suspense } from "react";
import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { CheckFlow } from "@/components/check/check-flow";
import { Header } from "@/components/layout/header";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { checkCopy } from "@/content/check";

export const metadata: Metadata = {
  title: "AI Visibility Check",
  robots: { index: false },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div data-tone="dark" className="min-h-dvh">
      <Header ctaHref="/#check" />
      <Section tone="dark" containerClassName="max-w-3xl py-10 md:py-16">
        {children}
      </Section>
    </div>
  );
}

async function Loaded({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CheckFlow id={id} contactDuringProgress={brand.features.contactDuringProgress} />;
}

export default function CheckPage({ params }: PageProps<"/check/[id]">) {
  return (
    <Suspense
      fallback={
        <Shell>
          <div className="text-center">
            <Eyebrow>{checkCopy.progress.eyebrow}</Eyebrow>
            <h1 className="mt-3 text-4xl leading-[1.08] sm:text-5xl">{checkCopy.progress.title}</h1>
            <p className="mt-2 text-tone-muted">{checkCopy.progress.subtitle}</p>
          </div>
        </Shell>
      }
    >
      <Loaded params={params} />
    </Suspense>
  );
}
