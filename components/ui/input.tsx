import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const controlClass =
  "h-12 w-full rounded-control border border-line-cream bg-surface-cream/70 px-3.5 text-base text-on-cream placeholder:text-muted-on-cream focus-visible:border-accent-strong aria-[invalid=true]:border-danger disabled:opacity-60";

/** Text input with an optional leading icon. Pass `ref` and react-hook-form's `register()` props straight through. */
export function Input({
  icon: Icon,
  className,
  ...props
}: React.ComponentProps<"input"> & { icon?: LucideIcon }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-[1.1rem] -translate-y-1/2 text-muted-on-cream" />
      )}
      <input className={cn(controlClass, Icon && "pl-10", className)} {...props} />
    </div>
  );
}
