"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Package,
  CalendarRange,
  Star,
  Newspaper,
  PartyPopper,
  Compass,
  Layers,
  RefreshCw,
} from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";

type Counts = {
  destinations: number;
  packages: number;
  itineraries: number;
  reviews: number;
  blogs: number;
  events: number;
  experiences: number;
  collections: number;
};

const emptyCounts: Counts = {
  destinations: 0,
  packages: 0,
  itineraries: 0,
  reviews: 0,
  blogs: 0,
  events: 0,
  experiences: 0,
  collections: 0,
};

export function AdminOverview() {
  const supabase = createBrowserSupabaseClient();
  const [counts, setCounts] = useState<Counts>(emptyCounts);
  const [loading, setLoading] = useState(true);

  async function loadCounts() {
    setLoading(true);
    const tables: { key: keyof Counts; table: string }[] = [
      { key: "destinations", table: "destinations" },
      { key: "packages", table: "packages" },
      { key: "itineraries", table: "itineraries" },
      { key: "reviews", table: "reviews" },
      { key: "blogs", table: "blogs" },
      { key: "events", table: "events" },
      { key: "experiences", table: "popular_experiences" },
      { key: "collections", table: "seasonal_collections" },
    ];

    const results = await Promise.all(
      tables.map(({ table }) =>
        supabase.from(table).select("id", { count: "exact", head: true })
      )
    );

    const next = { ...emptyCounts };
    tables.forEach(({ key }, i) => {
      next[key] = results[i].count ?? 0;
    });

    setCounts(next);
    setLoading(false);
  }

  useEffect(() => {
    loadCounts();
  }, []);

  const cards = [
    { label: "Destinations", value: counts.destinations, icon: MapPin },
    { label: "Packages", value: counts.packages, icon: Package },
    { label: "Itinerary Days", value: counts.itineraries, icon: CalendarRange },
    { label: "Reviews", value: counts.reviews, icon: Star },
    { label: "Blog Posts", value: counts.blogs, icon: Newspaper },
    { label: "Events", value: counts.events, icon: PartyPopper },
    { label: "Experiences", value: counts.experiences, icon: Compass },
    { label: "Collections", value: counts.collections, icon: Layers },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-ink tracking-[-0.01em]">Dashboard</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Overview of every content type powering the site.
          </p>
        </div>
        <button
          type="button"
          onClick={loadCounts}
          className="flex items-center gap-2 rounded-[10px] border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink/80 transition hover:bg-sage-100"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-[18px] border border-border bg-white p-6"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                <Icon className="h-4 w-4" />
                {card.label}
              </div>
              <p className="mt-3 text-3xl font-semibold text-ink">
                {loading ? "—" : card.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
