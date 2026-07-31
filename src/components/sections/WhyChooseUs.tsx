"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { features } from "@/data/site";

export function WhyChooseUs() {
  return (
    <section id="about" className="py-10 lg:py-16">
      <Container>
        <SectionHeading
          eyebrow="Why Us"
          title="Why Travel With Dream Travels"
          align="center"
        />
      </Container>
      <Marquee duration={50}>
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex w-64 sm:w-72 shrink-0 flex-col gap-3 rounded-2xl bg-surface p-6 shadow-soft border border-black/[0.04] transition-transform hover:-translate-y-1"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <feature.icon className="h-6 w-6" />
            </span>
            <h3 className="font-bold text-ink">{feature.title}</h3>
            <p className="text-sm text-ink/55 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
