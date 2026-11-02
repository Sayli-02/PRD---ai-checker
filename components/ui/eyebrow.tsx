import { cn } from "@/lib/utils";

/** Small uppercase label above a heading. Colour comes from the tone, so it works on dark and cream. */
export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-xs font-semibold tracking-[0.14em] text-tone-muted uppercase", className)} {...props} />;
}
