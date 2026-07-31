"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { stats } from "@/data/site";

export function Statistics() {
  return (
    <section className="py-14 lg:py-20 bg-ink relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,122,0,0.18),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(0,200,150,0.15),transparent_45%)]" />
      <Container className="relative">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-3xl lg:text-5xl font-bold text-white tabular-nums">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.id === "rating" ? 1 : 0}
                />
              </p>
              <p className="mt-2 text-sm lg:text-base text-white/60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
