"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { promos } from "@/data/promos";

const MotionLink = motion.create(Link);

function PromoCard({ promo }: { promo: (typeof promos)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="relative h-72 lg:h-80 overflow-hidden rounded-[24px]"
    >
      <motion.div style={{ y }} className="absolute inset-0 -top-8 -bottom-8">
        <Image src={promo.image} alt={promo.title} fill className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1e12]/75 via-[#0a1e12]/20 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6 lg:p-8">
        <h3 className="font-display text-xl lg:text-2xl font-semibold text-white tracking-[-0.02em]">{promo.title}</h3>
        <p className="mt-1.5 max-w-sm text-sm text-white/80">{promo.description}</p>
        <MotionLink
          href="#experiences"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "mt-4 w-fit inline-flex items-center justify-center gap-2 rounded-[12px] px-6 py-3 text-sm font-semibold transition-colors",
            "bg-white/90 backdrop-blur-md text-ink hover:bg-white"
          )}
        >
          Customize Your Trip
        </MotionLink>
      </div>
    </motion.div>
  );
}

export function PromoBanner() {
  return (
    <Section id="experiences">
      <Container>
        <SectionHeading eyebrow="Just For You" title="New Attractions" emoji="✨" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {promos.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
