import Image from "next/image";
import {
  ShieldCheck,
  BadgePercent,
  MessageCircle,
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
    title: "Transparent Pricing",
    description: "Clear per-person costs shared upfront — ask us exactly what's included.",
  },
  {
    icon: MessageCircle,
    title: "Plan Over WhatsApp",
    description: "Talk to a real planner before you commit — no auto-checkout, no pressure.",
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
    title: "Small Group Trips",
    description: "Curated departures with room to actually see the place, not a coach tour.",
  },
];

export function WhyChooseUs() {
  return (
    <Section tone="light" id="about" className="overflow-hidden py-8 sm:py-12 lg:py-16">
      <Container>
        <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch sm:gap-6 lg:gap-12">
          {/* Left info & photo */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <Reveal className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
                  Why Choose Dream Travels.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:mt-2.5 sm:text-base">
                  What makes travelling with us different? We go beyond standard generic tours to craft experiences that truly resonate.
                </p>
              </div>
              <div className="relative mt-4 aspect-[21/9] w-full flex-1 overflow-hidden rounded-[20px] border border-border/60 shadow-sm sm:mt-5 sm:aspect-[16/9] lg:aspect-auto lg:min-h-[180px]">
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
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 h-full">
              {whyPoints.map((point, index) => (
                <Reveal key={point.title} delay={index * 40} className="h-full">
                  <div className="group flex flex-col justify-between h-full rounded-[14px] border border-border/70 bg-surface/70 p-2.5 transition-all duration-300 hover:border-canopy/40 hover:bg-surface hover:shadow-md sm:rounded-[18px] sm:p-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5 sm:gap-3 sm:mb-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-sage text-canopy transition-transform duration-300 group-hover:scale-105 group-hover:bg-canopy group-hover:text-white sm:h-9 sm:w-9 sm:rounded-xl">
                          <point.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </span>
                        <span className="font-mono text-[10px] font-semibold tracking-wider text-ink-muted/40 sm:text-xs">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold tracking-tight text-ink transition-colors group-hover:text-canopy sm:text-base">
                        {point.title}
                      </h3>
                      <p className="mt-1 text-[11px] leading-snug text-ink-muted sm:mt-1.5 sm:text-[13px] sm:leading-relaxed">
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
