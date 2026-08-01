"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/ui/Section";
import { features } from "@/data/site";

export function WhyChooseUs() {
  return (
    <Section id="about">
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
            tabIndex={0}
            className="flex w-64 sm:w-72 shrink-0 flex-col gap-3 rounded-[18px] bg-white p-6 border border-border transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-sage-100 text-primary">
              <feature.icon className="h-6 w-6" />
            </span>
            <h3 className="font-semibold text-ink">{feature.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </Marquee>
    </Section>
  );
}
