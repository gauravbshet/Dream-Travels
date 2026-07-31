import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const viewportOnce = { once: true, margin: "-40px" } as const;

// Staggered per-index transition. Shared easing curve matches SectionHeading.
export const fadeUpDelay = (i = 0, step = 0.06) => ({
  duration: 0.5,
  delay: i * step,
  ease: [0.22, 1, 0.36, 1] as const,
});
