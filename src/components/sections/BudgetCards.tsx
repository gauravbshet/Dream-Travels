"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { budgetTiers as staticBudgetTiers } from "@/data/destinations";
import type { BudgetTier } from "@/data/destinations";
import type { Package } from "@/data/packages";

const MotionLink = motion.create(Link);

export function BudgetCards({
  tiers = staticBudgetTiers,
  packages,
}: {
  tiers?: BudgetTier[];
  packages?: Package[];
}) {
  const displayTiers = tiers.map((tier) => {
    const realCount = packages
      ? packages.filter((pkg) => pkg.price <= Number(tier.limit)).length
      : tier.count;

    return { ...tier, count: realCount };
  });

  return (
    <Section tone="sage" id="packages">
      <Container>
        <SectionHeading
          title="Budget Friendly"
        />
        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-4">
          {displayTiers.map((tier) => (
            <MotionLink
              key={tier.id}
              href={`/packages?maxPrice=${encodeURIComponent(tier.limit)}`}
              aria-label={`Browse packages ${tier.title}`}
              whileHover={{ y: -4 }}
              className="group flex items-center gap-4 rounded-[14px] bg-surface p-3.5 sm:p-4 border border-border text-left transition-colors hover:border-primary/30"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-sage-100 text-3xl">
                {tier.emoji}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">{tier.title}</h3>
                <p className="text-sm text-ink-muted">
                  {tier.count} {tier.count === 1 ? "verified package" : "verified packages"}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-ink/30 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </MotionLink>
          ))}
        </div>
      </Container>
    </Section>
  );
}
