"use client";

import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass rounded-3xl border border-white/50 shadow-float p-3 xl:p-2.5",
        "flex flex-col xl:flex-row xl:items-center gap-2",
        className
      )}
    >
      {fields.map((field, i) => (
        <div
          key={field.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 xl:px-5 rounded-2xl xl:rounded-none transition-colors hover:bg-white/60",
            i < fields.length - 1 && "xl:border-r xl:border-ink/10"
          )}
        >
          <field.icon className="h-4.5 w-4.5 text-primary shrink-0" />
          <div className="text-left">
            <p className="text-[11px] font-semibold text-ink/50 uppercase tracking-wide">
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
    </motion.div>
  );
}
