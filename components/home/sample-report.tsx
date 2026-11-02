import { Lock } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { home } from "@/content/home";
import { Reveal } from "./reveal";

const r = home.report;

// The preview is blurred STATIC placeholder content (bars and words), never real data.
export function SampleReport() {
  return (
    <Section tone="dark" id="sample-report" containerClassName="grid gap-10 py-14 md:grid-cols-2 md:items-center md:gap-16 md:py-20">
      <Reveal>
        <Eyebrow>{r.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-[2.25rem] leading-[1.08] sm:text-5xl">{r.title}</h2>
        <p className="mt-4 max-w-md text-lg text-tone-muted">{r.body}</p>
      </Reveal>

      <Reveal delay={120}>
        <div className="relative overflow-hidden rounded-card border border-tone-line bg-tone-surface p-6">
          <div aria-hidden className="grid gap-5 blur-[6px] select-none">
            {r.rows.map((row, i) => (
              <div key={row}>
                <p className="font-semibold">{row}</p>
                <div className="mt-2 h-2.5 rounded-full bg-tone-line">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${[72, 48, 85, 36][i % 4]}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 grid place-items-center bg-dark/40">
            <p className="flex items-center gap-2 rounded-full bg-cta-cream px-4 py-2 text-sm font-semibold text-on-cream">
              <Lock aria-hidden className="size-4" />
              {r.lock}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
