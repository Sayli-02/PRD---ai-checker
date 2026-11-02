import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

// Header + main + footer for every page that is not the landing page. `tone` is the reading surface.
export function PageShell({ children, tone = "cream" }: { children: React.ReactNode; tone?: "cream" | "dark" }) {
  return (
    <>
      <Header ctaHref="/#check" />
      <main id="main" data-tone={tone} className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
