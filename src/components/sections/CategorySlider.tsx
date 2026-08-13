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
    <Section tone="light" flush className="pt-2 pb-1 lg:pt-3 lg:pb-2">
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
                  className="group flex min-w-0 flex-col items-center gap-2 rounded-3xl transition-all duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-lg"
                >
                  <span
                    className={cn(
                      "flex h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border bg-surface transition-all duration-300 ease-in-out",
                      isActive
                        ? "border-primary text-white shadow-md"
                        : "border-border text-ink-muted hover:border-primary/40"
                    )}
                  >
                    <Icon
                      className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 ease-in-out group-hover:scale-110"
                      strokeWidth={1.75}
                    />
                  </span>
                  <span
                    className={cn(
                      "w-full text-center text-[11px] sm:text-xs lg:text-[13px] font-medium leading-tight transition-colors duration-300 ease-in-out",
                      isActive ? "text-primary" : "text-ink-muted group-hover:text-primary"
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
