import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { brand } from "@/config/brand";
import { home } from "@/content/home";

const t = home.testimonials;

// Renders nothing unless the flag is on AND real, approved quotes exist.
export function Testimonials() {
  if (!brand.features.showTestimonials || t.items.length === 0) return null;
  return (
    <Section tone="cream" containerClassName="py-14 md:py-20">
      <Eyebrow>{t.eyebrow}</Eyebrow>
      <h2 className="mt-3 text-[2.25rem] leading-[1.08] sm:text-5xl">{t.title}</h2>
      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {t.items.map((item) => (
          <li key={item.name}>
            <figure className="h-full rounded-card border border-tone-line bg-tone-surface p-6">
              <blockquote className="text-lg">&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm text-tone-muted">
                <strong className="text-tone-fg">{item.name}</strong>, {item.role}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
