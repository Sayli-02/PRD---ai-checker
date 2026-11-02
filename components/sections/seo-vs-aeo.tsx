import { site } from "@/content/site";

// Two boards side by side (stacked on a phone). AEO is the lit one.
export function SeoVsAeo() {
  const c = site.compare;
  return (
    <section className="on-paper bg-paper-deep">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 md:py-20">
        <h2 className="text-4xl font-bold sm:text-5xl">{c.title}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {c.columns.map((name, col) => {
            const lit = col === 1;
            return (
              <section
                key={name}
                aria-labelledby={`compare-${name}`}
                className={`rounded-lg p-5 sm:p-6 ${lit ? "on-board bg-board text-on-board" : "border border-rule bg-slip"}`}
              >
                <h3 id={`compare-${name}`} className="font-heading text-4xl font-bold">
                  {name}
                </h3>
                <p className={`mt-1 text-lg font-medium ${lit ? "text-signal" : "text-ink-muted"}`}>{c.subtitles[col]}</p>
                <dl className={`mt-4 divide-y ${lit ? "divide-board-line" : "divide-rule"}`}>
                  {c.rows.map((row) => (
                    <div key={row.label} className="py-3">
                      <dt className={`text-sm font-semibold ${lit ? "text-on-board-muted" : "text-ink-muted"}`}>{row.label}</dt>
                      <dd className="mt-0.5 text-lg">{row.values[col]}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
        <p className="mt-6 max-w-prose text-lg">{c.note}</p>
      </div>
    </section>
  );
}
