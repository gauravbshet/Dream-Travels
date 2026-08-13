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
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3 lg:mb-6">
            <div>
              <h2 className="display-section text-ink">Explore by map</h2>
              <p className="prose-measure mt-1.5 text-base text-ink-muted lg:text-lg">
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

        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          {/* Map plate */}
          <div className="relative flex flex-col items-center justify-between overflow-hidden rounded-[22px] border border-border/70 bg-[linear-gradient(135deg,#f8f6eb_0%,#eef5e5_100%)] p-4 shadow-[0_24px_70px_-28px_rgba(22,55,40,0.28)] sm:p-5 lg:col-span-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(76,135,87,0.16),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(251,190,60,0.16),transparent_38%)]" />
            <div className="absolute left-4 top-4 h-24 w-24 rounded-full border border-white/60 bg-white/35 blur-3xl" />
            <div className="absolute bottom-6 right-6 h-28 w-28 rounded-full border border-canopy/10 bg-canopy/10 blur-3xl" />

            <div className="my-auto w-full max-w-[460px] py-1">
              <svg
                viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
                className="relative h-auto w-full aspect-[1000/1065]"
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
                      strokeOpacity="0.07"
                      strokeWidth="1"
                    />
                  </pattern>
                  <radialGradient id="map-glow" cx="50%" cy="45%" r="60%">
                    <stop offset="0%" stopColor="var(--canopy)" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="var(--canopy)" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="landmass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e7efd9" />
                    <stop offset="100%" stopColor="#dce8ca" />
                  </linearGradient>
                  <filter id="pin-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="rgba(16, 24, 20, 0.2)" />
                  </filter>
                </defs>

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
                  fill="url(#landmass-gradient)"
                  stroke="var(--canopy)"
                  strokeOpacity="0.66"
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
                        <>
                          <circle
                            r="37"
                            fill="var(--canopy)"
                            fillOpacity="0.14"
                            className="pointer-events-none"
                          />
                          <circle
                            r="29"
                            fill="none"
                            stroke="var(--canopy)"
                            strokeOpacity="0.32"
                            strokeWidth="2"
                            className="pointer-events-none animate-pulse"
                          />
                        </>
                      )}
                      <circle
                        r="30"
                        fill="transparent"
                        onClick={() => setActiveId(pin.id)}
                      />
                      <circle
                        r={isActive ? 13 : 8.5}
                        fill={isActive ? "var(--canopy-hover)" : "var(--canopy)"}
                        stroke="#F9F7EE"
                        strokeWidth="3.5"
                        filter="url(#pin-shadow)"
                        className="pointer-events-none transition-all duration-300"
                      />
                      {isActive && (
                        <circle
                          r="17"
                          fill="none"
                          stroke="rgba(255,255,255,0.85)"
                          strokeWidth="1.5"
                          className="pointer-events-none animate-pulse"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="relative mt-2 text-center text-[11px] font-medium text-text-dark-secondary">
              Hover or tap a pin — full list below
            </p>
          </div>

          {/* Detail + region list */}
          <div className="flex flex-col gap-3.5 lg:col-span-5">
            <article className="overflow-hidden rounded-[16px] border border-border bg-surface shadow-xs">
              <div data-tone="dark" className="relative aspect-[2.6/1] sm:aspect-[2.8/1] lg:aspect-[2.5/1] w-full overflow-hidden">
                <Image
                  key={active.id}
                  src={active.image}
                  alt={active.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <span className="flex items-center gap-1 text-[11px] text-white/80">
                    <MapPin className="h-3 w-3 text-canopy" />
                    {active.state}
                  </span>
                  <h3 className="font-sans text-[17px] sm:text-[19px] font-bold leading-tight text-white">
                    {active.name}
                  </h3>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[12px] leading-relaxed text-ink-muted line-clamp-2">
                  {active.blurb}
                </p>
                <div className="mt-2 flex items-center justify-between border-t border-border/70 pt-2">
                  <div>
                    <p className="text-[10px] text-ink-muted">Starting from</p>
                    <p className="text-sm font-extrabold text-ink">
                      {formatPrice(active.fromPrice)}
                    </p>
                  </div>
                  <span className="rounded-full border border-border/70 px-2.5 py-0.5 text-[11px] font-medium text-ink-2">
                    {active.packageCount} packages
                  </span>
                </div>
              </div>
            </article>

            {/* Where we run trips card */}
            <div className="flex flex-1 flex-col justify-between rounded-[20px] border border-border/80 bg-surface/50 p-4 sm:p-5 shadow-xs backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between border-b border-border/60 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-ink/70">
                  Where We Run Trips
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                {byRegion.map((group) => (
                  <div key={group.region} className="group flex flex-col gap-1.5">
                    <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-wider text-ink before:h-px before:w-3 before:bg-canopy/40">
                      {group.region}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pl-4 sm:pl-5">
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
        "group relative flex items-center gap-2 overflow-hidden rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-300",
        active
          ? "scale-[1.02] border-canopy bg-canopy text-white shadow-md shadow-canopy/20"
          : "border-border/60 bg-surface text-ink-muted hover:scale-[1.02] hover:border-canopy/40 hover:bg-canopy/5 hover:text-ink"
      )}
    >
      <span className="relative z-10">{destination.name}</span>
      {destination.packageCount > 0 && (
        <span
          className={cn(
            "relative z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold transition-colors",
            active
              ? "bg-white/20 text-white"
              : "bg-ink/5 text-ink-muted group-hover:bg-canopy/10 group-hover:text-canopy"
          )}
        >
          {destination.packageCount}
        </span>
      )}
    </button>
  );
}
