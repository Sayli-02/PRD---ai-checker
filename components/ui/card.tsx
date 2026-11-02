import { cn } from "@/lib/utils";

/** A surface that follows the tone of the Section it sits in. */
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-card border border-tone-line bg-tone-surface text-tone-fg", className)} {...props} />;
}
