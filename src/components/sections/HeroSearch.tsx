"use client";

import { MapPin, CalendarDays, Users, Wallet, Sparkles, Search } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const fields = [
  { id: "destination", label: "Destination", placeholder: "Where to?", icon: MapPin },
  { id: "date", label: "Date", placeholder: "Add dates", icon: CalendarDays },
  { id: "guests", label: "Guests", placeholder: "Add guests", icon: Users },
  { id: "budget", label: "Budget", placeholder: "Any budget", icon: Wallet },
  { id: "style", label: "Travel Style", placeholder: "Any style", icon: Sparkles },
] as const;

export function HeroSearch({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-white rounded-[20px] border border-border shadow-[0_10px_35px_rgba(20,40,25,0.08)] p-3 md:p-4",
        "flex flex-col md:flex-row md:items-center gap-2",
        className
      )}
    >
      {fields.map((field, i) => (
        <div
          key={field.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 xl:px-5 rounded-[14px] xl:rounded-none transition-colors hover:bg-sage-100",
            i < fields.length - 1 && "xl:border-r xl:border-border"
          )}
        >
          <field.icon className="h-[18px] w-[18px] text-primary shrink-0" />
          <div className="text-left">
            <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">
              {field.label}
            </p>
            <p className="text-sm text-ink/70">{field.placeholder}</p>
          </div>
        </div>
      ))}
      <MagneticButton className="w-full xl:w-auto xl:ml-2 justify-center shrink-0">
        <Search className="h-4 w-4" />
        Search
      </MagneticButton>
    </div>
  );
}
