"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { seasonalCollections as staticCollections } from "@/data/destinations";
import type { SeasonalCollection } from "@/data/destinations";
import { cldUrl } from "@/lib/cloudinary";

export function SeasonalCollections({
  collections = staticCollections,
}: {
  collections?: SeasonalCollection[];
}) {
  return (
    <Section tone="image">
      <Container>
        <SectionHeading title="Seasonal Collections" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          {collections.map((c) => (
            <motion.div
              key={c.id}              whileHover={{ y: -4 }}
              className="group relative h-36 sm:h-44 lg:h-48 overflow-hidden rounded-[14px] border border-border"
            >
              <Image
                src={cldUrl(c.image, 600)}
                alt={c.title}
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/32 to-transparent" />
              <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-4">
                <span className="text-sm font-semibold text-white">{c.title}</span>
                <ArrowUpRight className="h-4 w-4 text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
