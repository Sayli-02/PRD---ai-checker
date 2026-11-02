import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { home } from "@/content/home";
import { Reveal } from "./reveal";

const p = home.problem;

// Soft lavender shape behind the chat card. The only non-flat shape on the page.
function Blob() {
  return (
    <svg aria-hidden viewBox="0 0 520 420" className="absolute -top-6 -right-6 -bottom-8 -left-4 h-[calc(100%+3.5rem)] w-[calc(100%+2.5rem)] text-accent-soft sm:-left-10 sm:w-[calc(100%+5rem)]" preserveAspectRatio="none">
      <path
        fill="currentColor"
        d="M120 40c70-40 190-28 270 12 78 40 124 132 108 206-14 68-76 128-170 142-96 14-214-4-282-62C-26 280 8 158 56 96c18-24 40-42 64-56z"
      />
    </svg>
  );
}

function ChatCard() {
  const e = p.example;
  return (
    <div className="relative isolate mx-auto w-full max-w-md py-4 md:max-w-none">
      <Blob />
      <div className="relative rounded-card border border-line-cream bg-surface-cream p-5 shadow-[0_20px_40px_-20px_rgb(20_17_15/0.35)] sm:p-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2.5 font-semibold">
            <span aria-hidden className="grid size-7 place-items-center rounded-full bg-on-cream text-xs font-bold text-cream">
              {e.engine[0]}
            </span>
            {e.engine}
          </span>
          <span className="text-xs text-tone-muted">{e.label}</span>
        </div>

        <p className="mt-4 ml-auto w-fit max-w-full rounded-full bg-cream px-4 py-2 text-[0.95rem]">{e.question}</p>
        <p className="mt-4 text-tone-muted">{e.answerIntro}</p>

        <ol className="mt-3 grid gap-2.5">
          {e.names.map((name, i) => (
            <li key={name} className="flex items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cream text-sm font-bold">{i + 1}</span>
              <span className="font-semibold">{name}</span>
              <sup className="ml-auto text-xs text-tone-muted">[{i + 1}]</sup>
            </li>
          ))}
          <li className="flex items-center gap-3 rounded-control border border-dashed border-tone-muted/60 px-3 py-2">
            <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border border-dashed border-tone-muted/60 text-sm font-bold text-tone-muted">
              {e.names.length + 1}
            </span>
            <span className="font-semibold text-tone-muted">{e.yours}</span>
            <span className="ml-auto text-sm font-semibold text-danger">{e.missing}</span>
          </li>
        </ol>
      </div>
    </div>
  );
}

export function ProblemMock() {
  return (
    <Section tone="cream" containerClassName="grid gap-10 py-14 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-16 md:py-20">
      <Reveal>
        <Eyebrow>{p.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-[2.25rem] leading-[1.08] sm:text-5xl">{p.title}</h2>
        <p className="mt-4 max-w-md text-lg text-tone-muted">{p.body}</p>
        <Link href="#sample-report" className={`${buttonVariants({ variant: "soft", size: "md" })} mt-6`}>
          {p.cta}
          <ArrowRight aria-hidden />
        </Link>
      </Reveal>
      <Reveal delay={120}>
        <ChatCard />
      </Reveal>
    </Section>
  );
}
