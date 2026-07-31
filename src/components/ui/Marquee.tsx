"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Marquee({
  children,
  className,
  reverse = false,
  duration = 42,
  gap = "gap-4 sm:gap-5 lg:gap-6",
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  duration?: number;
  gap?: string;
}) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      // Pause when any child card receives keyboard focus so keyboard users
      // can read content without it scrolling away.
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={cn("marquee-track flex w-max", gap)}
        style={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ["--marquee-duration" as any]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        <div className={cn("flex shrink-0", gap)}>{children}</div>
        <div className={cn("flex shrink-0", gap)} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
