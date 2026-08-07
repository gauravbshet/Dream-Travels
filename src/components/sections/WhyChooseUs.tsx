"use client";

import Image from "next/image";
import {
  ShieldCheck,
  BadgePercent,
  Lock,
  Sparkles,
  Headphones,
  BadgeCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { unsplash, IMG } from "@/data/images";

const whyPoints = [
  {
    icon: ShieldCheck,
    title: "Trusted Guides",
    description: "Vetted, experienced local guides who know every trail and hidden gem.",
  },
  {
    icon: BadgePercent,
    title: "Best Price Guarantee",
    description: "Transparent pricing with no hidden fees — found it cheaper? We'll match it.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Bank-grade encryption on every transaction, every time.",
  },
  {
    icon: Sparkles,
    title: "Personalized Trips",
    description: "Itineraries tailored to your pace, budget, and travel style.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock assistance before, during, and after your trip.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Reviews",
    description: "Real feedback from real travellers — no fake ratings, ever.",
  },
];

export function WhyChooseUs() {
  return (
    <Section tone="light" id="about">
      <Container>
        <SectionHeading
          title="Why Choose Dream Travels"
          description="What makes travelling with us different."
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="grid gap-6 sm:grid-cols-2">
            {whyPoints.map((point, index) => (
              <Reveal key={point.title} delay={index * 60} className="flex gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-surface-sage text-canopy">
                  <point.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-ink">{point.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{point.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] lg:aspect-square">
            <Image
              src={unsplash(IMG.mountain, 1200)}
              alt="Traveller enjoying a Dream Travels curated experience"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
