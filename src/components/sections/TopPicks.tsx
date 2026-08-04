import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResponsiveScroller } from "@/components/ui/ResponsiveScroller";
import { Section } from "@/components/ui/Section";
import { PackageCard } from "@/components/cards/PackageCard";
import { topPicks as staticTopPicks } from "@/data/packages";
import type { Package } from "@/data/packages";

export function TopPicks({ packages = staticTopPicks }: { packages?: Package[] }) {
  return (
    <Section>
      <Container>
        <SectionHeading
          title="Top Picks by Dream Travels"
          description="Our editorial team's favorite journeys this season."
        />
        <ResponsiveScroller gridClassName="lg:grid-cols-4 lg:gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              className="w-[78%] xs:w-[70%] sm:w-[46%] shrink-0 snap-start lg:w-full"
            />
          ))}
        </ResponsiveScroller>
      </Container>
    </Section>
  );
}
