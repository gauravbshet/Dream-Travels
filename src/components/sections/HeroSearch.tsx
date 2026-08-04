"use client";

import { MapPin, CalendarDays, Users, Wallet, Sparkles, Search } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useSpotlight } from "@/lib/useSpotlight";
import { cn } from "@/lib/utils";

const fields = [
  { id: "destination", label: "Destination", placeholder: "Where to?", icon: MapPin },
  { id: "date", label: "Date", placeholder: "Add dates", icon: CalendarDays },
  { id: "guests", label: "Guests", placeholder: "Add guests", icon: Users },
  { id: "budget", label: "Budget", placeholder: "Any budget", icon: Wallet },
  { id: "style", label: "Travel Style", placeholder: "Any style", icon: Sparkles },
] as const;

/**
 * Compact single-row search for small screens, where the five-field desktop
 * bar would stack into an unusable wall of controls.
 */
export function HeroSearchCompact({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-[14px] border border-black/5 bg-white p-2 shadow-[0_18px_40px_-14px_rgba(20,30,25,0.28)] backdrop-blur-xl",
        className
      )}
    >
      <button
        type="button"
        className="flex min-h-[48px] flex-1 items-center gap-3 rounded-[10px] px-3 text-left"
      >
        <MapPin className="h-[18px] w-[18px] shrink-0 text-canopy-deep" />
        <span className="min-w-0">
          <span className="block text-[11px] font-medium text-neutral-500">
            Destination
          </span>
          <span className="block truncate text-[15px] text-neutral-900">
            Where to next?
          </span>
        </span>
      </button>
      <button
        type="button"
        aria-label="Search trips"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-canopy-deep text-white active:scale-95"
      >
        <Search className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}

export function HeroSearch({ className }: { className?: string }) {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={cn(
        "spotlight rounded-[14px] border border-black/5 bg-white p-2.5 shadow-[0_24px_60px_-18px_rgba(20,30,25,0.32)] backdrop-blur-xl",
        "flex flex-col gap-1 md:flex-row md:items-center",
        className
      )}
    >
      {fields.map((field, i) => (
        <button
          key={field.id}
          type="button"
          className={cn(
            "group relative z-[3] flex flex-1 items-center gap-3 rounded-[11px] px-4 py-3 text-left transition-colors duration-[180ms] hover:bg-neutral-100",
            i < fields.length - 1 && "xl:rounded-none xl:border-r xl:border-black/10"
          )}
        >
          <field.icon className="h-[18px] w-[18px] shrink-0 text-canopy-deep" />
          <span className="min-w-0">
            <span className="block text-[11px] font-medium text-neutral-500">
              {field.label}
            </span>
            <span className="block truncate text-[15px] text-neutral-900">
              {field.placeholder}
            </span>
          </span>
        </button>
      ))}

      <MagneticButton className="relative z-[3] w-full shrink-0 justify-center bg-canopy-deep text-white hover:bg-[oklch(0.42_0.1_152)] xl:ml-2 xl:w-auto">
        <Search className="h-4 w-4" />
        Search
      </MagneticButton>
    </div>
  );
}
