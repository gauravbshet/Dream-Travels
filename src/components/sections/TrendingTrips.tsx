import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { Section } from "@/components/ui/Section";
import { PackageCard } from "@/components/cards/PackageCard";
import { packages } from "@/data/packages";

export function TrendingTrips() {
  return (
    <Section id="community">
      <Container>
        <div className="flex flex-wrap items-center gap-3 mb-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Live right now
          </span>
        </div>
        <SectionHeading
          eyebrow="Community Favorites"
          title="Trending Community Trips"
          emoji="🔥"
          description="Real trips booked and loved by fellow travellers right now."
        />
      </Container>
      <Marquee duration={56}>
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            className="w-[260px] xs:w-[280px] sm:w-[300px] lg:w-[320px]"
          />
        ))}
      </Marquee>
    </Section>
  );
}
