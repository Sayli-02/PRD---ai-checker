import { site } from "@/content/site";

// Platform indicator: the engines the check asks, as text. No logos, no counts until they are real.
export function TrustStrip() {
  const t = site.trust;
  return (
    <section aria-label="Engines covered" className="on-board border-t border-board-line bg-board-deep text-on-board">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="text-on-board-muted">{t.label}</span>
          {t.engines.map((e) => (
            <span key={e} className="font-heading text-xl font-semibold">
              {e}
            </span>
          ))}
        </p>
        <p className="text-sm text-on-board-muted">{t.note}</p>
      </div>
    </section>
  );
}
