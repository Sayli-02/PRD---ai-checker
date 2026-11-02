import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// primary: indigo, for use on cream cards. cream: the header CTA on dark. soft: lavender pill.
export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control font-semibold transition-colors select-none disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-accent-strong text-on-dark hover:bg-accent-strong/90",
        cream: "bg-cta-cream text-on-cream hover:bg-cta-cream/90",
        soft: "bg-accent-soft text-accent-strong hover:bg-accent-soft/80",
        outline: "border border-tone-line text-tone-fg hover:bg-tone-surface",
        ghost: "text-tone-fg hover:bg-tone-surface",
      },
      size: {
        sm: "h-10 px-3.5 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
