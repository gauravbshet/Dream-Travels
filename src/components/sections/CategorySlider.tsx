"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export function CategorySlider() {
  const [active, setActive] = useState(categories[0]?.id ?? "");

  return (
    // Intentionally tighter top spacing under the hero — flush overrides default py
    <Section tone="light" flush className="pt-6 pb-2 lg:py-10">
      <Container>
        <div
          className="grid gap-3 xs:gap-4 sm:gap-6 lg:gap-8"
          style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}
        >
          {categories.map((cat, i) => {
            const isActive = active === cat.id;
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                // NOTE: Category selection is currently decorative — it highlights
                // the active button visually but does not filter downstream content.
                // aria-pressed reflects the toggle state for screen readers.
                aria-pressed={isActive}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                whileTap={{ scale: 0.94 }}
                className="flex min-w-0 flex-col items-center gap-2"
              >
                <span
                  className={cn(
                    "flex h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border transition-all duration-300",
                    isActive
                      ? "bg-canopy border-primary text-white scale-105"
                      : "bg-surface border-border text-ink-muted hover:border-primary/40 hover:text-primary"
                  )}
                >
                  <Icon className="h-4.5 w-4.5 xs:h-5 xs:w-5 sm:h-6 sm:w-6" />
                </span>
                <span
                  className={cn(
                    "w-full text-center text-[11px] sm:text-xs lg:text-[13px] font-medium leading-tight transition-colors text-balance",
                    isActive ? "text-primary" : "text-ink-muted"
                  )}
                >
                  {cat.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
