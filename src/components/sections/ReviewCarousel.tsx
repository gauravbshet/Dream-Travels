"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Carousel } from "@/components/ui/Carousel";
import { Section } from "@/components/ui/Section";
import { reviews as staticReviews } from "@/data/reviews";
import type { Review } from "@/data/reviews";

export function ReviewCarousel({ reviews = staticReviews }: { reviews?: Review[] }) {
  return (
    <Section tone="light">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            title="Our Travellers' Experiences"
            className="mb-4 lg:mb-8"
          />
          <div className="mb-6 lg:mb-10 flex items-center gap-2 rounded-[14px] bg-surface px-4 py-3 border border-border">
            <span className="text-2xl font-semibold text-ink">4.9</span>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber text-amber" />
                ))}
              </div>
              <p className="text-xs text-ink-muted">Google Rating</p>
            </div>
          </div>
        </div>

        <Carousel label="Our Travellers' Experiences">
          {reviews.map((review) => (
            <motion.article
              key={review.id}
              className="w-[82%] xs:w-[72%] sm:w-[56%] lg:w-[360px] shrink-0 snap-start flex flex-col rounded-[14px] bg-surface p-6 border border-border"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm text-ink/80 leading-relaxed">
                {review.review}
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="relative h-11 w-11 overflow-hidden rounded-full">
                  <Image src={review.avatar} alt={review.name} fill sizes="44px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{review.name}</p>
                  <p className="text-xs text-ink-muted">{review.date}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </Carousel>
      </Container>
    </Section>
  );
}
