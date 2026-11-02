"use client";

import { useRef, useSyncExternalStore } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};

/**
 * Gentle fade and rise when scrolled into view. Content is visible without JavaScript and
 * with reduced motion; it is only hidden after hydration, until it enters the viewport.
 */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "motion-safe:transition-[opacity,translate] motion-safe:duration-500 motion-safe:ease-out",
        hydrated && !inView && "motion-safe:translate-y-3 motion-safe:opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
