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
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

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
    <Section tone="light" id="about" className="overflow-hidden py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          {/* Left info & photo */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <Reveal className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Why Choose Dream Travels.
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted sm:text-base">
                  What makes travelling with us different? We go beyond standard generic tours to craft experiences that truly resonate.
                </p>
              </div>
              <div className="relative mt-5 aspect-[16/10] w-full flex-1 overflow-hidden rounded-[20px] border border-border/60 shadow-sm sm:aspect-[16/9] lg:aspect-auto lg:min-h-[180px]">
                <Image
                  src="/dt.jpg"
                  alt="Dream Travels Experience"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </Reveal>
          </div>

          {/* Right 2-column feature grid */}
          <div className="flex flex-col justify-between lg:col-span-7">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 h-full">
              {whyPoints.map((point, index) => (
                <Reveal key={point.title} delay={index * 40} className="h-full">
                  <div className="group flex flex-col justify-between h-full rounded-[18px] border border-border/70 bg-surface/70 p-4 transition-all duration-300 hover:border-canopy/40 hover:bg-surface hover:shadow-md">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-sage text-canopy transition-transform duration-300 group-hover:scale-105 group-hover:bg-canopy group-hover:text-white">
                          <point.icon className="h-4 w-4" />
                        </span>
                        <span className="font-mono text-xs font-semibold tracking-wider text-ink-muted/40">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="text-base font-bold tracking-tight text-ink transition-colors group-hover:text-canopy">
                        {point.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-muted sm:text-[13px]">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
