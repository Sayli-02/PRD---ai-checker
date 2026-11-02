import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { HowWeWork } from "@/components/sections/how-we-work";
import { LatestPosts } from "@/components/sections/latest-posts";
import { Problem } from "@/components/sections/problem";
import { SampleReport } from "@/components/sections/sample-report";
import { SeoVsAeo } from "@/components/sections/seo-vs-aeo";
import { Testimonials } from "@/components/sections/testimonials";
import { TrustStrip } from "@/components/sections/trust-strip";
import { WhatItShows } from "@/components/sections/what-it-shows";
import { brand } from "@/config/brand";
import { site } from "@/content/site";

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${brand.url}/#organization`,
              name: brand.name,
              url: brand.url,
              description: brand.description,
              logo: `${brand.url}/apple-icon`,
            },
            { "@type": "WebSite", "@id": `${brand.url}/#website`, url: brand.url, name: brand.name },
            {
              "@type": "FAQPage",
              mainEntity: site.faq.items.map((i) => ({
                "@type": "Question",
                name: i.q,
                acceptedAnswer: { "@type": "Answer", text: i.a },
              })),
            },
          ],
        }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-signal focus:px-4 focus:py-2 focus:font-semibold focus:text-on-signal"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <TrustStrip />
        <Problem />
        <WhatItShows />
        <HowWeWork />
        <SeoVsAeo />
        <SampleReport />
        <Testimonials />
        <Suspense fallback={null}>
          <LatestPosts />
        </Suspense>
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
