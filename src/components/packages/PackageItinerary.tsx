"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  MapPin,
  Utensils,
  Hotel,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  Route,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ItineraryDay = {
  id: string;
  day: number;
  title: string;
  description: string | null;
  stay_location: string | null;
  stay_type: string | null;
  meals: string | null;
  image: string | null;
  optional_note: string | null;
};

export function PackageItinerary({ itinerary }: { itinerary: ItineraryDay[] }) {
  const [activeDay, setActiveDay] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"interactive" | "timeline">("interactive");
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true });

  if (!itinerary || itinerary.length === 0) return null;

  const currentDayData = itinerary.find((d) => d.day === activeDay) || itinerary[0];

  const toggleDayExpanded = (dayNum: number) => {
    setExpandedDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const toggleExpandAll = () => {
    const allExpanded = itinerary.every((d) => expandedDays[d.day]);
    const newState: Record<number, boolean> = {};
    itinerary.forEach((d) => {
      newState[d.day] = !allExpanded;
    });
    setExpandedDays(newState);
  };

  return (
    <section id="itinerary" className="scroll-mt-36 space-y-6">
      {/* Section Header with View Mode Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-canopy/10 text-canopy font-bold text-xs">
              <Route className="h-4 w-4" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-ink">Journey Itinerary</h2>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            {itinerary.length}-Day curated travel experience & daily schedule
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center rounded-full border border-border/80 bg-surface p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("interactive")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all",
                viewMode === "interactive"
                  ? "bg-canopy text-white shadow-xs"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <Compass className="h-3.5 w-3.5" /> Interactive Day View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all",
                viewMode === "timeline"
                  ? "bg-canopy text-white shadow-xs"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <Layers className="h-3.5 w-3.5" /> Full Timeline
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: Interactive Day Stepper Experience */}
      {viewMode === "interactive" && (
        <div className="space-y-4">
          {/* Responsive Day Stepper Grid (Fits all days on screen on mobile!) */}
          <div className="grid grid-cols-5 gap-1.5 sm:flex sm:items-center sm:gap-2">
            {itinerary.map((day) => {
              const isSelected = day.day === activeDay;
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setActiveDay(day.day)}
                  className={cn(
                    "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 rounded-[14px] border py-2 px-1 sm:px-4 text-xs font-bold transition-all duration-200",
                    isSelected
                      ? "border-canopy bg-canopy text-white shadow-xs"
                      : "border-border/80 bg-surface text-ink hover:border-canopy/40 hover:bg-sage-100/50"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold transition-colors",
                      isSelected ? "bg-white text-canopy" : "bg-canopy/10 text-canopy"
                    )}
                  >
                    {day.day}
                  </span>
                  <span className="text-[11px] font-bold">Day {day.day}</span>
                  <span className="hidden md:inline line-clamp-1 max-w-[90px] text-[11px] font-medium opacity-90">
                    {day.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Day Showcase Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDayData.day}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="overflow-hidden rounded-[18px] sm:rounded-[22px] border border-border/80 bg-surface shadow-2xs"
            >
              {/* Day Header Banner */}
              <div className="relative h-36 sm:h-48 w-full overflow-hidden bg-surface-dark">
                {currentDayData.image ? (
                  <Image
                    src={currentDayData.image}
                    alt={currentDayData.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-canopy-dark to-black/80" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 sm:p-5 text-white">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                    <span className="rounded-full bg-canopy px-2.5 py-0.5 text-white shadow-2xs">
                      Day {currentDayData.day} of {itinerary.length}
                    </span>
                    {currentDayData.stay_location && (
                      <span className="rounded-full bg-black/50 px-2.5 py-0.5 backdrop-blur-md border border-white/20 truncate max-w-[180px] sm:max-w-none">
                        📍 {currentDayData.stay_location}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 text-base sm:text-xl font-bold tracking-tight text-white leading-snug line-clamp-2">
                    {currentDayData.title}
                  </h3>
                </div>
              </div>

              {/* Day Body Content */}
              <div className="p-4 sm:p-5 space-y-4">
                {/* Overview Description */}
                {currentDayData.description && (
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-canopy">Daily Overview</h4>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-ink/80 font-normal">
                      {currentDayData.description}
                    </p>
                  </div>
                )}

                {/* Compact Schedule Timeline Row */}
                <div className="space-y-2 pt-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-canopy">Day Schedule</h4>
                  <div className="grid gap-2 sm:grid-cols-3 text-xs">
                    <div className="flex items-start gap-2.5 rounded-[12px] border border-amber-200/80 bg-amber-50/40 p-2.5">
                      <Sunrise className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-900 block text-[11px]">Morning</span>
                        <span className="text-[11px] text-ink/80 leading-tight">Breakfast & Guided Sightseeing</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-[12px] border border-emerald-200/80 bg-emerald-50/40 p-2.5">
                      <Sun className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-900 block text-[11px]">Afternoon</span>
                        <span className="text-[11px] text-ink/80 leading-tight">Attractions & Photo Stops</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-[12px] border border-indigo-200/80 bg-indigo-50/40 p-2.5">
                      <Moon className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-indigo-900 block text-[11px]">Evening / Night</span>
                        <span className="text-[11px] text-ink/80 leading-tight">Resort Stay & Dinner</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logistics Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/60 text-[11px] font-semibold">
                  {currentDayData.meals && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-3 py-1 text-ink">
                      <Utensils className="h-3 w-3 text-canopy shrink-0" />
                      <span>Meals: <strong className="text-ink">{currentDayData.meals}</strong></span>
                    </span>
                  )}
                  {currentDayData.stay_location && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-3 py-1 text-ink truncate max-w-full">
                      <Hotel className="h-3 w-3 text-canopy shrink-0" />
                      <span className="truncate">Stay: <strong className="text-ink">{currentDayData.stay_location}</strong></span>
                    </span>
                  )}
                  {currentDayData.optional_note && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-3 py-1 text-amber-900 leading-normal">
                      <Sparkles className="h-3 w-3 text-amber-600 shrink-0" />
                      <span>Note: {currentDayData.optional_note}</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* MODE 2: Continuous Timeline View */}
      {viewMode === "timeline" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={toggleExpandAll}
              className="text-xs font-bold text-canopy hover:underline"
            >
              {itinerary.every((d) => expandedDays[d.day]) ? "Collapse All Days" : "Expand All Days"}
            </button>
          </div>

          <div className="relative space-y-6 border-l-2 border-canopy/40 pl-6 sm:pl-8 ml-3 sm:ml-4">
            {itinerary.map((day) => {
              const isExpanded = expandedDays[day.day] ?? true;
              return (
                <div key={day.id} className="relative group">
                  <span className="absolute -left-[37px] sm:-left-[45px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-canopy text-xs font-extrabold text-white shadow-xs">
                    {day.day}
                  </span>

                  <div className="rounded-[20px] border border-border/80 bg-surface overflow-hidden shadow-2xs transition-all hover:shadow-xs">
                    <button
                      type="button"
                      onClick={() => toggleDayExpanded(day.day)}
                      className="flex w-full items-center justify-between p-5 text-left font-bold text-ink hover:bg-sage-100/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-canopy bg-canopy/10 px-2.5 py-1 rounded-md">
                          Day {day.day}
                        </span>
                        <span className="text-base font-bold">{day.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-muted">
                        {day.stay_location && (
                          <span className="hidden sm:inline text-xs font-medium text-ink-muted">📍 {day.stay_location}</span>
                        )}
                        {isExpanded ? <ChevronUp className="h-5 w-5 text-canopy" /> : <ChevronDown className="h-5 w-5 text-ink-muted" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-border/60 space-y-4">
                        {day.description && (
                          <p className="text-sm leading-relaxed text-ink/80 pt-3">{day.description}</p>
                        )}
                        {day.image && (
                          <div className="relative h-48 w-full overflow-hidden rounded-[14px]">
                            <Image src={day.image} alt={day.title} fill sizes="600px" className="object-cover" />
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-ink-muted pt-2">
                          {day.meals && <span className="rounded-full bg-sage-100 px-3 py-1 text-ink">🍽 {day.meals}</span>}
                          {day.stay_location && (
                            <span className="rounded-full bg-sage-100 px-3 py-1 text-ink">
                              🏨 {day.stay_location} {day.stay_type ? `(${day.stay_type})` : ""}
                            </span>
                          )}
                          {day.optional_note && (
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800 border border-amber-200">
                              💡 {day.optional_note}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
