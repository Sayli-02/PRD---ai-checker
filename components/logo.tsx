import { brand } from "@/config/brand";
import { Mark } from "./mark";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className="inline-flex">
        <Mark size={size} />
      </span>
      <span className="font-heading text-2xl leading-none font-semibold tracking-tight">{brand.name}</span>
    </span>
  );
}
