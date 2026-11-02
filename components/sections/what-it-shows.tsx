import { site } from "@/content/site";

// One ruled chart, not four cards: items sit on a shared column grid.
export function WhatItShows() {
  const s = site.shows;
  return (
    <section className="on-paper bg-paper-deep">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 md:py-20">
        <h2 className="text-4xl font-bold sm:text-5xl">{s.title}</h2>
        <ul className="mt-8 grid border-y-2 border-ink md:grid-cols-4 md:divide-x md:divide-rule">
          {s.items.map((item) => (
            <li key={item.title} className="border-b border-rule py-5 last:border-b-0 md:border-b-0 md:px-5 md:first:pl-0 md:last:pr-0">
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="mt-1 text-ink-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
