import { Label } from "@/components/ui/label";

export const controlClass =
  "h-12 w-full rounded-md border border-ink-muted bg-white px-3 text-base text-ink placeholder:text-ink-muted/80 focus-visible:border-board aria-[invalid=true]:border-missing disabled:opacity-60";

/** Visible label above every control; the error is tied to it with aria-describedby by the caller. */
export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-missing">
          {error}
        </p>
      )}
    </div>
  );
}
