import { cn } from "@/lib/utils";

/** Small lavender chip. Use `buttonVariants({ variant: "soft" })` when it must be a link or button. */
export function Pill({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold text-accent-strong", className)} {...props} />
  );
}
