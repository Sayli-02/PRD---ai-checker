import { Lock } from "lucide-react";
import { site } from "@/content/site";

// A blurred layout preview built from markup (no raster). Hidden from assistive tech: it is decoration.
const preview = [
  ["Mention rate", "Named in some answers, missing from others"],
  ["Competitors named instead", "Name one, name two, name three"],
  ["Sources AI trusts", "site-one.com, site-two.in, site-three.org"],
  ["Plan for the next 90 days", "Step one, step two, step three"],
];

export function SampleReport() {
  const r = site.report;
  return (
    <section className="on-paper bg-paper">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-14 md:py-20">
        <div>
          <h2 className="text-4xl font-bold sm:text-5xl">{r.title}</h2>
          <p className="mt-4 max-w-prose text-lg text-ink-muted">{r.body}</p>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-rule bg-slip">
          <div aria-hidden className="pointer-events-none p-5 blur-[6px] select-none sm:p-6">
            <p className="font-heading text-3xl font-bold">Your AI Visibility Report</p>
            <dl className="mt-3 divide-y divide-rule border-y border-rule">
              {preview.map(([term, value]) => (
                <div key={term} className="grid grid-cols-[1fr_1.4fr] gap-3 py-3">
                  <dt className="font-semibold">{term}</dt>
                  <dd className="text-ink-muted">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="absolute inset-0 grid place-items-center p-4">
            <p className="inline-flex items-center gap-2 rounded-md bg-board px-4 py-3 font-semibold text-on-board shadow-lg">
              <Lock aria-hidden className="size-5" />
              {r.lock}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
