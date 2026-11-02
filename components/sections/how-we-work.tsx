import { site } from "@/content/site";

export function HowWeWork() {
  const h = site.how;
  return (
    <section id="how" className="on-paper scroll-mt-16 bg-paper">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 md:py-20">
        <h2 className="max-w-3xl text-4xl font-bold sm:text-5xl">{h.title}</h2>
        <ol className="mt-8 grid gap-0 md:grid-cols-3 md:gap-8">
          {h.steps.map((step, i) => (
            <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-rule py-5 md:grid-cols-1 md:border-t-2 md:border-ink">
              {/* The order is the information here, so the numbers stay. */}
              <span className="grid size-12 place-items-center rounded-sm bg-board font-heading text-3xl font-bold text-on-board">
                {i + 1}
              </span>
              <div>
                <h3 className="text-2xl font-semibold">{step.title}</h3>
                <p className="mt-1 text-ink-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
