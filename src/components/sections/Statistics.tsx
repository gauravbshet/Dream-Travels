"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { Section } from "@/components/ui/Section";
import { stats } from "@/data/site";

export function Statistics() {
  // No verified figures to show means no section at all — rendering an empty
  // dark band would be worse than omitting it. See the note on `stats`.
  if (stats.length === 0) return null;

  return (
    <Section tone="dark">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,125,87,0.18),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(47,99,63,0.18),transparent_45%)]" />
      <Container className="relative">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}              className="text-center"
            >
              <p className="text-3xl lg:text-5xl font-bold text-ink tabular-nums">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.id === "rating" ? 1 : 0}
                />
              </p>
              <p className="mt-2 text-sm lg:text-base text-ink-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
