"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResponsiveScroller } from "@/components/ui/ResponsiveScroller";
import { Section } from "@/components/ui/Section";
import { fadeUp, viewportOnce, fadeUpDelay } from "@/lib/motion";
import { popularExperiences as staticExperiences } from "@/data/destinations";
import type { PopularExperience } from "@/data/destinations";

export function PopularExperiences({
  experiences = staticExperiences,
}: {
  experiences?: PopularExperience[];
}) {
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Do More" title="Popular Experiences" />
        <ResponsiveScroller gridClassName="lg:grid-cols-4 xl:grid-cols-8 lg:gap-4">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              transition={fadeUpDelay(i)}
              className="group relative h-40 w-[42%] xs:w-[36%] sm:w-[26%] shrink-0 snap-start overflow-hidden rounded-[18px] border border-border lg:w-full"
            >
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                sizes="(max-width: 768px) 40vw, 12vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <span className="absolute inset-x-0 bottom-3 text-center text-sm font-semibold text-white">
                {exp.title}
              </span>
            </motion.div>
          ))}
        </ResponsiveScroller>
      </Container>
    </Section>
  );
}
