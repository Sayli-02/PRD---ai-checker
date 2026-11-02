// Two leaning strokes that meet at a peak, as in the reference logo: a lavender stroke and a light one.
// Master file: public/brand/mark.svg. Colours come from brand tokens; the light stroke follows currentColor.
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M3 28 13.5 5h5L8 28z" fill="var(--accent)" />
      <path d="M15.5 28 21 16l3.5 7.5L29 28z" fill="currentColor" />
    </svg>
  );
}
