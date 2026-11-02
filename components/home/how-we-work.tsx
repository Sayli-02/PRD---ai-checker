import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/ui/eyebrow";
import { home } from "@/content/home";
import { Reveal } from "./reveal";

const h = home.how;

// Typographic steps, not icon cards: big serif numerals on a hairline.
export function HowWeWork() {
  return (
    <Section tone="dark" id="how" containerClassName="py-14 md:py-20">
      <Reveal>
        <Eyebrow>{h.eyebrow}</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-[2.25rem] leading-[1.08] sm:text-5xl">{h.title}</h2>
      </Reveal>
      <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line-dark">
        {h.steps.map((step, i) => (
          <li key={step.title} className="md:px-8 md:first:pl-0 md:last:pr-0">
            <Reveal delay={i * 100}>
              <p aria-hidden className="font-serif text-6xl leading-none text-tone-accent italic">
                {i + 1}
              </p>
              <h3 className="mt-4 font-sans text-xl font-semibold tracking-normal">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs text-tone-muted">{step.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
