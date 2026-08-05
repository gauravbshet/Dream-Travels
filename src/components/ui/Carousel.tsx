"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Horizontal scroll-snap track with paged prev/next controls.
 * Controls hide entirely when the content does not overflow.
 */
export function Carousel({
  children,
  label,
  className,
  itemClassName,
}: {
  children: React.ReactNode;
  /** Accessible name for the scrollable region. */
  label: string;
  className?: string;
  itemClassName?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflows(max > 8);
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft >= max - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync]);

  const page = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Advance by a viewport-width of cards, less a sliver for continuity.
    const distance = Math.max(el.clientWidth * 0.8, 240);
    el.scrollBy({
      left: direction * distance,
      behavior: reduced ? "auto" : "smooth",
    });
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 sm:gap-5 lg:gap-6",
          itemClassName
        )}
      >
        {children}
      </div>

      {overflows && (
        <>
          <Arrow
            side="left"
            disabled={atStart}
            onClick={() => page(-1)}
            label={`Scroll ${label} backward`}
          />
          <Arrow
            side="right"
            disabled={atEnd}
            onClick={() => page(1)}
            label={`Scroll ${label} forward`}
          />
        </>
      )}
    </div>
  );
}

function Arrow({
  side,
  disabled,
  onClick,
  label,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "absolute top-[38%] z-[10] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full",
        "border border-[rgba(76,159,34,0.12)] bg-white/90 text-ink shadow-sm backdrop-blur-md",
        "transition-[opacity,border-color,transform] duration-[320ms] ease-[cubic-bezier(0.165,0.84,0.44,1)]",
        "hover:border-[rgba(76,159,34,0.2)] hover:scale-105 active:scale-95 sm:flex",
        disabled && "pointer-events-none opacity-0",
        side === "left" ? "left-2 lg:left-3" : "right-2 lg:right-3"
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
