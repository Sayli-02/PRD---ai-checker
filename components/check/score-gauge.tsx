import { bands } from "@/content/check";
import { Badge } from "@/components/ui/badge";

const R = 54;
const C = 2 * Math.PI * R;

export function ScoreGauge({ score }: { score: number }) {
  const band = bands.find((b) => score >= b.min) ?? bands[bands.length - 1];
  const tone = score >= 70 ? "success" : score >= 40 ? "warning" : "danger";
  return (
    <div className="relative mx-auto grid size-44 place-items-center sm:size-52">
      <svg viewBox="0 0 128 128" className="size-full -rotate-90" aria-hidden>
        <circle cx="64" cy="64" r={R} fill="none" stroke="currentColor" className="text-tone-line" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={R}
          fill="none"
          stroke="currentColor"
          className="text-accent"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(C * score) / 100} ${C}`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <p className="font-serif text-5xl leading-none tabular-nums">
          {score}
          <span className="ml-0.5 text-lg text-tone-muted">/100</span>
        </p>
      </div>
      <Badge tone={tone} className="absolute -bottom-1">
        {band.label}
      </Badge>
    </div>
  );
}
