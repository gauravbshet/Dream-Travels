"use client";

import Image from "next/image";
import { Utensils, Hotel, Sparkles, Route } from "lucide-react";

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
  if (!itinerary || itinerary.length === 0) return null;

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

      </div>

      <div className="space-y-4">
        <div className="relative space-y-6 border-l-2 border-canopy/40 pl-6 sm:pl-8 ml-3 sm:ml-4">
          {itinerary.map((day) => (
            <div key={day.id} className="relative group">
              <span className="absolute -left-[37px] sm:-left-[45px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-canopy text-xs font-extrabold text-white shadow-xs">
                {day.day}
              </span>

              <div className="rounded-[20px] border border-border/80 bg-surface overflow-hidden shadow-2xs transition-all hover:shadow-xs">
                <div className="flex w-full items-center justify-between p-5 text-left font-bold text-ink">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-canopy bg-canopy/10 px-2.5 py-1 rounded-md">
                      Day {day.day}
                    </span>
                    <span className="text-base font-bold">{day.title}</span>
                  </div>
                  {day.stay_location && (
                    <span className="hidden sm:inline text-xs font-medium text-ink-muted">📍 {day.stay_location}</span>
                  )}
                </div>

                <div className="p-5 pt-0 border-t border-border/60 space-y-4">
                  {day.description && (
                    <div 
                        className="text-sm leading-relaxed text-ink/80 pt-3 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: day.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                    />
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
