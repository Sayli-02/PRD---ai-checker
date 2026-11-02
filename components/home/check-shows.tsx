import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { home } from "@/content/home";
import { icons } from "./icons";
import { Reveal } from "./reveal";

const s = home.shows;

// Four columns divided by hairlines on desktop, 2x2 on tablet, one column on phones.
export function CheckShows() {
  return (
    <Section tone="cream" containerClassName="pb-14 md:pb-20">
      <Reveal className="border-t border-tone-line pt-8">
        <Eyebrow>{s.eyebrow}</Eyebrow>
        <ul className="mt-6 grid gap-y-0 divide-y divide-line-cream sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {s.items.map((item, i) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.title} className={`flex gap-4 py-5 sm:flex-col sm:py-4 lg:px-6 ${i === 0 ? "lg:pl-0" : ""}`}>
                <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-control bg-accent-soft text-accent-strong">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-sans text-lg font-semibold tracking-normal">{item.title}</h3>
                  <p className="mt-1 max-w-[16rem] text-tone-muted">{item.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
