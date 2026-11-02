import { cn } from "@/lib/utils";

export type Tone = "dark" | "cream";

/**
 * A full-width band that sets the tone. Everything inside uses the semantic tone-* classes,
 * so the same component works on dark and cream (and a toggle can be added later).
 * `backdrop` renders behind the content (for example the hero photo).
 */
export function Section({
  tone,
  id,
  className,
  containerClassName,
  backdrop,
  children,
  ...props
}: {
  tone: Tone;
  containerClassName?: string;
  backdrop?: React.ReactNode;
} & React.ComponentProps<"section">) {
  return (
    <section id={id} data-tone={tone} className={cn("scroll-mt-16", backdrop && "relative isolate overflow-hidden", className)} {...props}>
      {backdrop}
      <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", backdrop && "relative", containerClassName)}>{children}</div>
    </section>
  );
}
