"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { formatPrice, cn } from "@/lib/utils";
import {
  INDIA_OUTLINE,
  MAP_VIEWBOX,
  mapDestinations,
  projectPoint,
  regionOrder,
  type MapDestination,
} from "@/data/map";

export function ExploreByMap() {
  const [activeId, setActiveId] = useState<string>(mapDestinations[0].id);

  const pins = useMemo(
    () =>
      mapDestinations.map((d) => ({ ...d, ...projectPoint(d.lng, d.lat) })),
    []
  );

  const active =
    mapDestinations.find((d) => d.id === activeId) ?? mapDestinations[0];

  const byRegion = useMemo(() => {
    return regionOrder
      .map((region) => ({
        region,
        items: mapDestinations.filter((d) => d.region === region),
      }))
      .filter((g) => g.items.length > 0);
  }, []);

  const totalPackages = mapDestinations.reduce(
    (sum, d) => sum + d.packageCount,
    0
  );

  return (
    <Section tone="light" id="map">
      <Container>
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-12">
            <div>
              <h2 className="display-section text-ink">Explore by map</h2>
              <p className="prose-measure mt-3 text-base text-ink-muted lg:text-lg">
                Tap a pin to see what we run there. {totalPackages} curated
                departures across {mapDestinations.length} destinations.
              </p>
            </div>
            <Link
              href="#packages"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-canopy transition-colors hover:text-ink"
            >
              View all destinations
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:gap-6">
          {/* Map plate */}
          <div className="relative overflow-hidden rounded-[14px] border border-border bg-[#F5F5EE] p-3 sm:p-5">
            <svg
              viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
              className="mx-auto h-auto w-full max-w-[520px]"
              role="img"
              aria-label="Map of India showing Dream Travels destinations"
            >
              <defs>
                <pattern
                  id="map-grid"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M50 0 L0 0 0 50"
                    fill="none"
                    stroke="var(--canopy)"
                    strokeOpacity="0.06"
                    strokeWidth="1"
                  />
                </pattern>
                <radialGradient id="map-glow" cx="50%" cy="45%" r="60%">
                  <stop
                    offset="0%"
                    stopColor="var(--canopy)"
                    stopOpacity="0.08"
                  />
                  <stop offset="100%" stopColor="var(--canopy)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Graticule behind the landmass */}
              <rect
                width={MAP_VIEWBOX.width}
                height={MAP_VIEWBOX.height}
                fill="url(#map-grid)"
              />
              <rect
                width={MAP_VIEWBOX.width}
                height={MAP_VIEWBOX.height}
                fill="url(#map-glow)"
              />

              <path
                d={INDIA_OUTLINE}
                fill="#E5EEDC"
                stroke="var(--canopy)"
                strokeOpacity="0.55"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {pins.map((pin) => {
                const isActive = pin.id === activeId;
                return (
                  <g
                    key={pin.id}
                    transform={`translate(${pin.x} ${pin.y})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveId(pin.id)}
                  >
                    {isActive && (
                      <circle
                        r="34"
                        fill="var(--canopy)"
                        fillOpacity="0.12"
                        className="pointer-events-none"
                      />
                    )}
                    {/* Generous invisible hit area for touch */}
                    <circle
                      r="30"
                      fill="transparent"
                      onClick={() => setActiveId(pin.id)}
                    />
                    <circle
                      r={isActive ? 11 : 7}
                      fill={isActive ? "var(--canopy-hover)" : "var(--canopy)"}
                      stroke="#F5F5EE"
                      strokeWidth="3"
                      className="pointer-events-none transition-all duration-300"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Pins are decorative-only for AT; the list below is the real control. */}
            <p className="mt-2 text-center text-[11px] text-text-dark-secondary">
              Hover or tap a pin — full list below
            </p>
          </div>

          {/* Detail + region list */}
          <div className="flex flex-col gap-5">
            <article className="overflow-hidden rounded-[14px] border border-border bg-surface">
              <div data-tone="dark" className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  key={active.id}
                  src={active.image}
                  alt={active.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.02_158/0.46)] via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="flex items-center gap-1.5 text-[12px] text-ink-2">
                    <MapPin className="h-3.5 w-3.5 text-canopy" />
                    {active.state}
                  </span>
                  <h3 className="font-display mt-1 text-[24px] leading-tight text-ink">
                    {active.name}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-[14px] leading-relaxed text-ink-muted">
                  {active.blurb}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-[11px] text-ink-muted">Starting from</p>
                    <p className="text-lg font-semibold text-ink">
                      {formatPrice(active.fromPrice)}
                    </p>
                  </div>
                  <span className="rounded-full border border-border px-3 py-1.5 text-[12px] text-ink-2">
                    {active.packageCount} packages
                  </span>
                </div>
              </div>
            </article>

            <div className="rounded-[14px] border border-border bg-surface p-4">
              <h3 className="mb-3 text-[13px] font-semibold text-ink">
                Where we run trips
              </h3>
              <div className="flex flex-col gap-4">
                {byRegion.map((group) => (
                  <div key={group.region}>
                    <p className="mb-2 text-[11px] text-ink-muted">
                      {group.region}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((d) => (
                        <RegionChip
                          key={d.id}
                          destination={d}
                          active={d.id === activeId}
                          onSelect={() => setActiveId(d.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function RegionChip({
  destination,
  active,
  onSelect,
}: {
  destination: MapDestination;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-[40px] items-center gap-2 rounded-full border px-3.5 text-[13px] transition-colors duration-[180ms]",
        active
          ? "border-canopy bg-canopy/15 text-ink"
          : "border-border text-ink-muted hover:border-border-lit hover:text-ink-2"
      )}
    >
      {destination.name}
      <span className={cn("text-[11px]", active ? "text-canopy" : "text-ink-muted")}>
        {destination.packageCount}
      </span>
    </button>
  );
}
