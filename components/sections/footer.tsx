import Link from "next/link";
import { Logo } from "@/components/logo";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { brand } from "@/config/brand";
import { site } from "@/content/site";

const socialLabels = { instagram: "Instagram", linkedin: "LinkedIn" } as const;

export function Footer() {
  const socials = Object.entries(brand.socials).filter(([, url]) => url);
  return (
    <footer className="on-board border-t border-board-line bg-board-deep text-on-board">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-on-board-muted">{site.footer.tagline}</p>
        </div>

        <div className="grid content-start gap-3">
          <h2 className="font-heading text-xl font-semibold">Contact</h2>
          {brand.contact.email && (
            <a href={`mailto:${brand.contact.email}`} className="underline">
              {brand.contact.email}
            </a>
          )}
          <WhatsAppLink location="footer" />
          {socials.map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="underline">
              {socialLabels[name as keyof typeof socialLabels]}
            </a>
          ))}
        </div>

        <nav aria-label="Legal" className="grid content-start gap-3">
          <h2 className="font-heading text-xl font-semibold">Legal</h2>
          {site.footer.legal.map((l) => (
            <Link key={l.href} href={l.href} className="underline">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="border-t border-board-line px-5 py-4 text-center text-sm text-on-board-muted">
        &copy; {brand.name}
      </p>
    </footer>
  );
}
