"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { promos } from "@/data/promos";

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
      className="relative h-72 lg:h-80 overflow-hidden rounded-[28px] shadow-card"
    >
      <motion.div style={{ y }} className="absolute inset-0 -top-8 -bottom-8">
        <Image src={promo.image} alt={promo.title} fill className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6 lg:p-8">
        <h3 className="text-xl lg:text-2xl font-bold text-white">{promo.title}</h3>
        <p className="mt-1.5 max-w-sm text-sm text-white/80">{promo.description}</p>
        <MagneticButton variant="secondary" className="mt-4 w-fit !py-2.5">
          Customize Your Trip
        </MagneticButton>
      </div>
    </motion.div>
  );
}

export function PromoBanner() {
  return (
    <section id="experiences" className="py-10 lg:py-16">
      <Container>
        <SectionHeading eyebrow="Just For You" title="New Attractions ✨" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {promos.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      </Container>
    </section>
  );
}
