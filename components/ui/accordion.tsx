import { ChevronDown } from "lucide-react";

/** Native <details>, not Base UI. Keyboard and screen-reader support for free. Share `name` to allow one open at a time. */
export function AccordionItem({
  question,
  name,
  children,
}: {
  question: string;
  name?: string;
  children: React.ReactNode;
}) {
  return (
    <details name={name} className="group border-b border-tone-line">
      <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 text-left text-tone-fg">
        <h3 className="font-sans text-lg font-semibold tracking-normal">{question}</h3>
        <ChevronDown aria-hidden className="size-5 shrink-0 text-tone-muted transition-transform group-open:rotate-180 motion-reduce:transition-none" />
      </summary>
      <div className="max-w-prose pb-5 text-tone-muted">{children}</div>
    </details>
  );
}
