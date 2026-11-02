import { brand } from "@/config/brand";
import { Mark } from "./mark";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Mark size={size} />
      <span className="font-serif text-[1.65rem] leading-none tracking-tight">{brand.name}</span>
    </span>
  );
}
