"use client";

import { useEffect, useState } from "react";
import { MapPin, Package, Users, RefreshCw } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";

type Counts = {
  destinations: number;
  packages: number;
  customers: number;
};

const emptyCounts: Counts = {
  destinations: 0,
  packages: 0,
  customers: 0,
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
      { key: "customers", table: "profiles" },
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
    { label: "Customers", value: counts.customers, icon: Users },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-ink tracking-[-0.01em]">Dashboard</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Quick summary of your travel inventory and customer base.
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
