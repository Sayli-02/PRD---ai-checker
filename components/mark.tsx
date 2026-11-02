// A C ring with a square berth in its opening: "cite" plus a point that is picked out.
// One colour (currentColor), still reads at 32 x 32. Master file: public/brand/mark.svg.
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M25.5 9.5A11 11 0 1 0 25.5 22.5" stroke="currentColor" strokeWidth="5" />
      <rect x="21.5" y="13.5" width="5" height="5" fill="currentColor" />
    </svg>
  );
}
