import { CheckForm } from "@/components/check/check-form";
import { Section } from "@/components/layout/section";
import { home } from "@/content/home";

const c = home.finalCta;

export function FinalCta() {
  return (
    <Section tone="dark" id="check" containerClassName="grid gap-8 py-14 md:grid-cols-2 md:items-center md:gap-16 md:py-20">
      <div>
        <h2 className="text-[2.25rem] leading-[1.08] sm:text-5xl">{c.title}</h2>
        <p className="mt-3 max-w-md text-lg text-tone-muted">{c.body}</p>
      </div>
      <CheckForm location="final" />
    </Section>
  );
}
