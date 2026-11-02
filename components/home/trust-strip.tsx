import { Section } from "@/components/layout/section";
import { brand } from "@/config/brand";
import { home } from "@/content/home";
import { getCheckCount } from "@/lib/stats";

const t = home.trust;

// Engine names are text only, with a neutral monogram. No official logos.
export async function TrustStrip() {
  const count = brand.features.showCheckCount ? await getCheckCount() : null;
  return (
    <Section tone="cream" className="border-b border-tone-line" containerClassName="flex flex-wrap items-center gap-x-8 gap-y-4 py-6">
      <p className="text-sm text-tone-muted">{t.label}</p>
      <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 sm:divide-x sm:divide-line-cream">
        {t.engines.map((name) => (
          <li key={name} className="flex items-center gap-2.5 font-semibold sm:pl-8 sm:first:pl-0">
            <span aria-hidden className="grid size-7 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-strong">
              {name[0]}
            </span>
            {name}
          </li>
        ))}
      </ul>
      {count !== null && (
        <p className="w-full border-tone-line sm:ml-auto sm:w-auto sm:border-l sm:pl-8">
          <span className="block font-serif text-3xl leading-none">{count.toLocaleString("en-IN")}</span>
          <span className="text-sm text-tone-muted">{t.countLabel}</span>
        </p>
      )}
    </Section>
  );
}
