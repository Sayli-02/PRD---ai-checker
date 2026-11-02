import { CheckForm } from "@/components/check/check-form";
import { site } from "@/content/site";

export function FinalCta() {
  const c = site.finalCta;
  return (
    <section className="on-board bg-board text-on-board">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 md:items-center md:gap-14 md:py-20">
        <div>
          <h2 className="text-4xl leading-tight font-bold sm:text-5xl">{c.title}</h2>
          <p className="mt-4 max-w-prose text-lg text-on-board-muted">{c.body}</p>
        </div>
        <CheckForm location="final" />
      </div>
    </section>
  );
}
