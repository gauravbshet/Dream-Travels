"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { fadeUp, viewportOnce, fadeUpDelay } from "@/lib/motion";
import { budgetTiers } from "@/data/destinations";

const MotionLink = motion.create(Link);

export function BudgetCards() {
  return (
    <Section id="packages">
      <Container>
        <SectionHeading
          eyebrow="Plan Smart"
          title="Budget Friendly"
          emoji="💰"
        />
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
          {budgetTiers.map((tier, i) => (
            <MotionLink
              key={tier.id}
              href="#packages"
              aria-label={`Browse ${tier.title} destinations`}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              transition={fadeUpDelay(i)}
              whileHover={{ y: -4 }}
              className="group flex items-center gap-4 rounded-2xl bg-surface p-5 shadow-soft border border-black/[0.04] text-left transition-shadow hover:shadow-card"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                {tier.emoji}
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-ink">{tier.title}</h3>
                <p className="text-sm text-ink/55">
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
