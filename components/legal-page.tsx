import { PageShell } from "@/components/page-shell";

// Typography for long plain-text pages (privacy, terms).
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 md:py-16">
        <h1 className="text-5xl font-bold sm:text-6xl">{title}</h1>
        <p className="mt-2 text-ink-muted">Last updated {updated}</p>
        <div className="mt-8 text-lg [&_a]:font-semibold [&_a]:underline [&_h2]:mt-9 [&_h2]:mb-2 [&_h2]:text-3xl [&_h2]:font-bold [&_li]:my-1 [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </article>
    </PageShell>
  );
}
