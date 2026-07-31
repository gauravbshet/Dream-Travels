"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { budgetTiers } from "@/data/destinations";

export function BudgetCards() {
  return (
    <section id="packages" className="py-10 lg:py-16">
      <Container>
        <SectionHeading eyebrow="Plan Smart" title="Budget Friendly 💰" />
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
          {budgetTiers.map((tier, i) => (
            <motion.button
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
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
            </motion.button>
          ))}
        </div>
      </Container>
    </section>
  );
}
