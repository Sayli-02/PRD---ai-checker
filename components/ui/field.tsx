import { cn } from "@/lib/utils";

/** Visible label above a control. The caller ties the control to the error with aria-describedby={`${id}-error`}. */
export function Field({
  id,
  label,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-tone-fg">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-sm text-tone-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
