"use client";

import { useEffect, useState } from "react";
import { MapPin, Package, Users, RefreshCw } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { AdminButton, AdminCard, AdminPageHeader } from "./ui";

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
      <AdminPageHeader
        title="Dashboard"
        description="Quick summary of your travel inventory and customer base."
        action={
          <AdminButton variant="secondary" onClick={loadCounts}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </AdminButton>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <AdminCard key={card.label}>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-admin-ink-muted">
                <Icon className="h-4 w-4" />
                {card.label}
              </div>
              <p className="mt-3 text-3xl font-semibold text-admin-ink">
                {loading ? "—" : card.value}
              </p>
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}
