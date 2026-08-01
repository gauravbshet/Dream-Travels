"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  emoji,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  /** Decorative emoji rendered after the title, hidden from screen readers. */
  emoji?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "mb-6 lg:mb-10",
        align === "center" && "text-center mx-auto max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <span className="text-primary font-medium text-xs tracking-[0.14em] uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-balance mt-2 text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-ink tracking-[-0.025em] leading-[1.1]">
        {title}
        {emoji && (
          <span aria-hidden="true" className="ml-2">
            {emoji}
          </span>
        )}
      </h2>
      {description && (
        <p className="mt-3 text-text-secondary text-base lg:text-lg max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
