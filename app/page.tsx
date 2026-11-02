import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { BlogPreview } from "@/components/home/blog-preview";
import { CheckShows } from "@/components/home/check-shows";
import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { HowWeWork } from "@/components/home/how-we-work";
import { ProblemMock } from "@/components/home/problem-mock";
import { SampleReport } from "@/components/home/sample-report";
import { SeoVsAeo } from "@/components/home/seo-vs-aeo";
import { Testimonials } from "@/components/home/testimonials";
import { TrustStrip } from "@/components/home/trust-strip";
import { brand } from "@/config/brand";
import { home } from "@/content/home";

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
              mainEntity: home.faq.items.map((i) => ({
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
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-control focus:bg-cta-cream focus:px-4 focus:py-2 focus:font-semibold focus:text-on-cream"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Suspense fallback={null}>
          <TrustStrip />
        </Suspense>
        <ProblemMock />
        <CheckShows />
        <HowWeWork />
        <SeoVsAeo />
        <SampleReport />
        <Testimonials />
        <Suspense fallback={null}>
          <BlogPreview />
        </Suspense>
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
