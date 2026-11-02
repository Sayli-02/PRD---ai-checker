import Link from "next/link";
import { Logo } from "@/components/logo";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { brand } from "@/config/brand";
import { home } from "@/content/home";

const socialLabels = { instagram: "Instagram", linkedin: "LinkedIn" } as const;

export function Footer() {
  const socials = Object.entries(brand.socials).filter(([, url]) => url);
  return (
    <footer data-tone="dark" className="border-t border-tone-line">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-tone-muted">{brand.tagline}</p>
        </div>

        <div className="grid content-start gap-2">
          <h2 className="font-serif text-xl">Contact</h2>
          {brand.contact.email && (
            <a href={`mailto:${brand.contact.email}`} className="inline-flex min-h-11 items-center underline">
              {brand.contact.email}
            </a>
          )}
          <WhatsAppLink location="footer" className="min-h-11" />
          {socials.map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline">
              {socialLabels[name as keyof typeof socialLabels]}
            </a>
          ))}
        </div>

        <nav aria-label="Legal" className="grid content-start gap-2">
          <h2 className="font-serif text-xl">Legal</h2>
          {home.footer.legal.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center underline">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="border-t border-tone-line px-5 py-4 text-center text-sm text-tone-muted">&copy; {brand.name}</p>
    </footer>
  );
}
