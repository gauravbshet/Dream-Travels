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
    <Section tone="light" id="about" className="overflow-hidden py-16 sm:py-24 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* Left sticky column */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <Reveal>
              <h2 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                Why Choose<br className="hidden lg:block" /> Dream Travels.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
                What makes travelling with us different? We go beyond the standard generic tours to craft experiences that truly resonate.
              </p>
              <div className="mt-10 flex w-full justify-center lg:justify-start">
                <div className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-[24px] shadow-lg">
                  <Image
                    src="/dt.jpg"
                    alt="Dream Travels Experience"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right list column */}
          <div className="lg:col-span-7">
            <div className="flex flex-col">
              {whyPoints.map((point, index) => (
                <Reveal key={point.title} delay={index * 50}>
                  <div className="group relative border-t border-border py-8 transition-colors hover:border-ink/30 sm:py-10">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
                      
                      {/* Icon & Number column */}
                      <div className="flex items-center gap-5 sm:flex-col sm:items-start sm:gap-6">
                        <span className="font-mono text-sm font-semibold tracking-wider text-ink-muted/50 transition-colors group-hover:text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-sage text-canopy transition-all duration-500 ease-out group-hover:scale-110 group-hover:bg-canopy group-hover:text-white">
                          <point.icon className="h-5 w-5" />
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pt-1 sm:pt-2">
                        <h3 className="text-xl font-bold tracking-tight text-ink sm:text-2xl transition-colors group-hover:text-primary">
                          {point.title}
                        </h3>
                        <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg sm:mt-4">
                          {point.description}
                        </p>
                      </div>

                    </div>
                  </div>
                </Reveal>
              ))}
              <div className="border-t border-border"></div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
