"use client";

import { useRef, useSyncExternalStore } from "react";
import { useInView } from "motion/react";
import { Check, X } from "lucide-react";
import { site } from "@/content/site";

// The page's one authored moment: the answer chart clears in row by row, like a board refreshing.
// Rows are visible without JavaScript; they are only hidden after hydration, until scrolled into view.
export function Problem() {
  const p = site.problem;
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  // false on the server and during hydration, true afterwards.
  const armed = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const row = (i: number) => ({
    className: armed && !inView ? "opacity-0" : "motion-safe:animate-[row-in_0.45s_cubic-bezier(0.16,1,0.3,1)_both]",
    style: { animationDelay: `${i * 220}ms` },
  });

  return (
    <section className="on-paper bg-paper">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 md:items-center md:gap-14 md:py-20">
        <div>
          <h2 className="text-4xl leading-tight font-bold sm:text-5xl">{p.title}</h2>
          <p className="mt-4 max-w-prose text-lg text-ink-muted">{p.body}</p>
        </div>

        <figure className="overflow-hidden rounded-lg border border-rule bg-slip shadow-[0_12px_32px_-16px_rgb(14_23_38/0.35)]">
          <div className="flex items-center justify-between bg-board px-4 py-2.5 text-on-board">
            <span className="font-heading text-lg font-semibold">{p.example.engine}</span>
            <span className="text-sm text-on-board-muted">{p.example.label}</span>
          </div>
          <div className="p-4 sm:p-5">
            <p className="inline-block rounded-md bg-paper-deep px-3 py-1.5 font-medium">{p.example.question}</p>
            <p className="mt-4 text-ink-muted">{p.example.answerIntro}</p>
            <ol ref={ref} className="mt-2 divide-y divide-rule border-y border-rule">
              {p.example.names.map((name, i) => (
                <li key={name} style={row(i).style} className={`grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 py-3 ${row(i).className}`}>
                  <span className="grid size-9 place-items-center rounded-sm bg-board font-heading text-lg font-bold text-on-board">
                    {i + 1}
                  </span>
                  <span className="font-semibold">{name}</span>
                  <Check aria-hidden className="size-5 text-confirmed" />
                </li>
              ))}
              <li
                style={row(p.example.names.length).style}
                className={`grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 bg-missing/10 py-3 ${row(p.example.names.length).className}`}
              >
                <span className="grid size-9 place-items-center rounded-sm bg-missing text-on-board">
                  <X aria-hidden className="size-5" />
                </span>
                <span className="font-semibold">{p.example.yours}</span>
                <span className="text-sm font-bold text-missing">{p.example.missing}</span>
              </li>
            </ol>
          </div>
        </figure>
      </div>
    </section>
  );
}
