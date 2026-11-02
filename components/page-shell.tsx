import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";

// Header + main + footer for every page that is not the landing page.
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="on-paper flex-1 bg-paper">
        {children}
      </main>
      <Footer />
    </>
  );
}
