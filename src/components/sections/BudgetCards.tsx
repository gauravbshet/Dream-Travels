"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { budgetTiers as staticBudgetTiers } from "@/data/destinations";
import type { BudgetTier } from "@/data/destinations";

const MotionLink = motion.create(Link);

export function BudgetCards({ tiers = staticBudgetTiers }: { tiers?: BudgetTier[] }) {
  return (
    <Section id="packages">
      <Container>
        <SectionHeading
          title="Budget Friendly"
        />
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
          {tiers.map((tier) => (
            <MotionLink
              key={tier.id}
              href="#packages"
              aria-label={`Browse ${tier.title} destinations`}              whileHover={{ y: -4 }}
              className="group flex items-center gap-4 rounded-[14px] bg-surface p-5 border border-border text-left transition-colors hover:border-primary/30"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-sage-100 text-3xl">
                {tier.emoji}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">{tier.title}</h3>
                <p className="text-sm text-ink-muted">
                  {tier.count} verified destinations
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
