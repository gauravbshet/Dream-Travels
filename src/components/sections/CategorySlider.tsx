"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export function CategorySlider() {
  const [active, setActive] = useState("nearby");

  return (
    // Intentionally tighter top spacing under the hero — flush overrides default py
    <Section tone="light" flush className="pt-6 pb-2 lg:py-10">
      <Container>
        <div
          className={cn(
            "flex gap-5 overflow-x-auto no-scrollbar pb-1",
            "sm:gap-6",
            "lg:grid lg:grid-cols-6 xl:grid-cols-12 lg:gap-4 lg:overflow-visible"
          )}
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
                aria-pressed={isActive}                transition={{ duration: 0.35, delay: i * 0.03 }}
                whileTap={{ scale: 0.94 }}
                className="flex shrink-0 flex-col items-center gap-2 lg:shrink"
              >
                <span
                  className={cn(
                    "flex h-16 w-16 lg:h-14 lg:w-14 xl:h-16 xl:w-16 items-center justify-center rounded-2xl border transition-all duration-300",
                    isActive
                      ? "bg-canopy border-primary text-white scale-105"
                      : "bg-surface border-border text-ink-muted hover:border-primary/40 hover:text-primary"
                  )}
                >
                  <Icon className="h-6 w-6 lg:h-5 lg:w-5 xl:h-6 xl:w-6" />
                </span>
                <span
                  className={cn(
                    "text-xs lg:text-[13px] font-medium transition-colors whitespace-nowrap",
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
