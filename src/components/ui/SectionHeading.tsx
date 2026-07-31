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
        <span className="text-primary font-semibold text-sm tracking-wide uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-balance mt-1 text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem] font-bold text-ink tracking-tight">
        {title}
        {emoji && (
          <span aria-hidden="true" className="ml-2">
            {emoji}
          </span>
        )}
      </h2>
      {description && (
        <p className="mt-3 text-ink/60 text-base lg:text-lg max-w-2xl">
          {description}
        </p>
      )}
    </motion.div>
  );
}
