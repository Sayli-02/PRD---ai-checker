import { CheckForm } from "@/components/check/check-form";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="on-board bg-board text-on-board">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 pt-6 pb-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pt-14 lg:pb-14">
        <div>
          <h1 className="text-[2.5rem] leading-[1.02] font-bold sm:text-6xl lg:text-7xl">{site.hero.title}</h1>
          <p className="mt-3 max-w-prose text-lg text-on-board-muted sm:text-xl lg:mt-5">{site.hero.subtitle}</p>
          <ul className="mt-8 hidden gap-6 lg:flex">
            {site.hero.points.map((p) => (
              <li key={p} className="border-t-2 border-signal pt-2 font-heading text-xl font-semibold">
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div id="check" className="scroll-mt-20">
          <CheckForm location="hero" />
        </div>
      </div>
    </section>
  );
}
