"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Layout effect on the client (arms before paint, so there is no flash of the
// visible state); plain effect on the server, where it never runs.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Scroll reveal that enhances an already-visible default.
 *
 * Content renders visible and stays visible if JS, the observer, or the
 * animation never runs — a headless render or a background tab must never ship
 * a blank section. The hidden start state is applied only once the client has
 * confirmed it can also remove it. Written straight to the DOM so arming costs
 * no extra render.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Stagger offset in ms. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const easing = "cubic-bezier(0.16,1,0.3,1)";
    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition = `opacity 640ms ${easing} ${delay}ms, transform 640ms ${easing} ${delay}ms`;
    el.style.willChange = "opacity, transform";

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.willChange = "";
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);

    // Backstop: if the observer never reports (hidden tab, headless renderer),
    // reveal anyway rather than leaving the section blank.
    const failsafe = window.setTimeout(reveal, 1500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [delay]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
