"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { categories } from "@/data/categories";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export function CategorySlider() {
  const pathname = usePathname();

  return (
    <Section tone="light" flush className="pt-6 pb-2 lg:py-10">
      <Container>
        <div
          className="grid gap-3 xs:gap-4 sm:gap-6 lg:gap-8"
          style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}
        >
          {categories.map((cat, i) => {
            const href = `/categories/${cat.id}`;
            const isActive = pathname === href;
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                whileTap={{ scale: 0.94 }}
              >
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
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
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
