"use client";

import { MapPin, CalendarDays, Users, Sparkles, Search } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useSpotlight } from "@/lib/useSpotlight";
import { cn } from "@/lib/utils";

const fields = [
  { id: "destination", label: "Destination", placeholder: "Yogyakarta City", icon: MapPin },
  { id: "checkin", label: "Check in", placeholder: "3 June 2024", icon: CalendarDays },
  { id: "checkout", label: "Check out", placeholder: "6 June 2024", icon: CalendarDays },
  { id: "guests", label: "Guests", placeholder: "2 guests", icon: Users },
  { id: "type", label: "Type Stays", placeholder: "All Types", icon: Sparkles },
] as const;

/**
 * Compact single-row search for small screens, where the five-field desktop
 * bar would stack into an unusable wall of controls.
 */
export function HeroSearchCompact({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-[14px] border border-[rgba(76,159,34,0.12)] bg-white/95 p-2 shadow-[0_24px_56px_-32px_rgba(44,88,28,0.16)] backdrop-blur-xl",
        className
      )}
    >
      <button
        type="button"
        className="flex min-h-[48px] flex-1 items-center gap-3 rounded-[12px] border border-[rgba(76,159,34,0.08)] bg-surface px-3 text-left"
      >
        <MapPin className="h-[18px] w-[18px] shrink-0 text-canopy-deep" />
        <span className="min-w-0">
          <span className="block text-[11px] font-medium text-ink-muted">
            Destination
          </span>
          <span className="block truncate text-[15px] text-ink">
            Yogyakarta City
          </span>
        </span>
      </button>
      <button
        type="button"
        aria-label="Search trips"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-canopy text-white shadow-sm transition-transform duration-[180ms] active:scale-95"
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
        "spotlight rounded-[18px] border border-[rgba(76,159,34,0.14)] bg-[rgba(255,255,255,0.94)] p-3 shadow-[0_32px_80px_-42px_rgba(41,77,37,0.18)] backdrop-blur-xl",
        "flex flex-col gap-3 md:flex-row md:items-center",
        className
      )}
    >
      {fields.map((field, i) => (
        <button
          key={field.id}
          type="button"
          className={cn(
            "group relative z-[3] flex flex-1 min-w-0 items-center gap-3 rounded-[16px] border border-[rgba(76,159,34,0.08)] bg-surface px-4 py-4 text-left transition duration-[180ms] hover:border-canopy/30 hover:bg-surface-2",
            i < fields.length - 1 && "xl:rounded-none xl:border-r xl:border-[rgba(76,159,34,0.1)]"
          )}
        >
          <field.icon className="h-[18px] w-[18px] shrink-0 text-canopy-deep" />
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold text-ink-muted">
              {field.label}
            </span>
            <span className="block truncate text-[15px] text-ink">
              {field.placeholder}
            </span>
          </span>
        </button>
      ))}

      <MagneticButton className="relative z-[3] w-full shrink-0 justify-center rounded-[16px] bg-canopy px-5 py-4 text-sm font-semibold text-white shadow-sm transition duration-[180ms] hover:bg-canopy-hover xl:ml-3 xl:w-auto">
        <Search className="h-4 w-4" />
        Search
      </MagneticButton>
    </div>
  );
}
