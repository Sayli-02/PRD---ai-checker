import { site } from "@/content/site";

// Renders nothing until real, approved testimonials are added to content/site.ts. Never add fake ones.
export function Testimonials() {
  const t = site.testimonials;
  if (t.items.length === 0) return null;
  return (
    <section className="on-paper bg-paper-deep">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 md:py-20">
        <h2 className="text-4xl font-bold sm:text-5xl">{t.title}</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {t.items.map((item) => (
            <li key={item.name}>
              <figure>
                <blockquote className="text-xl">{item.quote}</blockquote>
                <figcaption className="mt-3 font-semibold">
                  {item.name}, <span className="font-normal text-ink-muted">{item.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
