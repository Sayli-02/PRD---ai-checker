import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { controlClass } from "./input";

/** Native select (best on phones) with a chevron and optional leading icon. */
export function Select({
  icon: Icon,
  className,
  children,
  ...props
}: React.ComponentProps<"select"> & { icon?: LucideIcon }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-[1.1rem] -translate-y-1/2 text-muted-on-cream" />
      )}
      <select className={cn(controlClass, "appearance-none pr-10", Icon && "pl-10", className)} {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-on-cream" />
    </div>
  );
}
