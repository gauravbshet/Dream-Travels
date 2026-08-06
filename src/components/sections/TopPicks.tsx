import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Carousel } from "@/components/ui/Carousel";
import { Section } from "@/components/ui/Section";
import { PackageCard } from "@/components/cards/PackageCard";
import { topPicks as staticTopPicks } from "@/data/packages";
import type { Package } from "@/data/packages";

export function TopPicks({ packages = staticTopPicks }: { packages?: Package[] }) {
  return (
    <Section tone="light">
      <Container>
        <SectionHeading
          title="Top Picks by Dream Travels"
          description="Our editorial team's favorite journeys this season."
        />
      </Container>
      <Carousel label="Top picks by Dream Travels">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            className="snap-start"
          />
        ))}
      </Carousel>
    </Section>
  );
}
