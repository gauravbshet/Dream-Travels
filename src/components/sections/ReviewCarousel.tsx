"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResponsiveScroller } from "@/components/ui/ResponsiveScroller";
import { Section } from "@/components/ui/Section";
import { fadeUp, viewportOnce, fadeUpDelay } from "@/lib/motion";
import { reviews } from "@/data/reviews";

export function ReviewCarousel() {
  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Testimonials"
            title="Our Travellers' Experiences"
            className="mb-4 lg:mb-8"
          />
          <div className="mb-6 lg:mb-10 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-soft">
            <span className="text-2xl font-bold text-ink">4.9</span>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-xs text-ink/50">Google Rating</p>
            </div>
          </div>
        </div>

        <ResponsiveScroller gridClassName="lg:grid-cols-3 lg:gap-6">
          {reviews.map((review, i) => (
            <motion.article
              key={review.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              transition={fadeUpDelay(i)}
              className="w-[82%] xs:w-[72%] sm:w-[56%] shrink-0 snap-start lg:w-full flex flex-col rounded-3xl bg-surface p-6 shadow-soft border border-black/[0.04]"
            >
              <Quote className="h-7 w-7 text-primary/25" />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm text-ink/70 leading-relaxed">
                {review.review}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full">
                  <Image src={review.avatar} alt={review.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{review.name}</p>
                  <p className="text-xs text-ink/45">{review.date}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </ResponsiveScroller>
      </Container>
    </Section>
  );
}
