"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Package,
  Users,
  Clapperboard,
  RefreshCw,
  Plus,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ImageOff,
  Tag,
  FileWarning,
  Compass,
} from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { formatPrice } from "@/lib/utils";
import { categories, categoryLabels, type CategorySlug } from "@/data/categories";
import type { AdminSection } from "./AdminDashboard";
import { AdminBadge, AdminButton, AdminCard, AdminPageHeader } from "./ui";

type PackageSlim = {
  id: string;
  title: string;
  image: string | null;
  category: string | null;
  status: string | null;
  price: number | null;
  destination_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  destinations: { name: string }[] | null;
};

type DestinationSlim = {
  id: string;
  name: string;
  is_featured: boolean | null;
  created_at: string | null;
};

type ReelSlim = {
  id: string;
  title: string;
  is_active: boolean | null;
  created_at: string | null;
};

type ProfileSlim = {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string | null;
};

type ActivityItem = {
  key: string;
  label: string;
  title: string;
  at: string;
  section: AdminSection;
};

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function formatRelativeTime(iso: string) {
  const diffMs = new Date(iso).getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  if (Math.abs(diffMinutes) < 60) return relativeTimeFormatter.format(diffMinutes, "minute");
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return relativeTimeFormatter.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  return relativeTimeFormatter.format(diffDays, "day");
}

function isSameMonth(iso: string | null) {
  if (!iso) return false;
  const date = new Date(iso);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export function AdminOverview({ onNavigate }: { onNavigate: (section: AdminSection) => void }) {
  const supabase = createBrowserSupabaseClient();

  const [packages, setPackages] = useState<PackageSlim[] | null>(null);
  const [destinations, setDestinations] = useState<DestinationSlim[] | null>(null);
  const [reels, setReels] = useState<ReelSlim[] | null>(null);
  const [profiles, setProfiles] = useState<ProfileSlim[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    setLoading(true);
    setError(null);

    const [packagesRes, destinationsRes, reelsRes, profilesRes] = await Promise.all([
      supabase
        .from("packages")
        .select("id,title,image,category,status,price,destination_id,created_at,updated_at,destinations(name)")
        .order("created_at", { ascending: false }),
      supabase.from("destinations").select("id,name,is_featured,created_at"),
      supabase.from("reels").select("id,title,is_active,created_at"),
      supabase.from("profiles").select("id,full_name,email,created_at").order("created_at", { ascending: false }),
    ]);

    const firstError =
      packagesRes.error || destinationsRes.error || reelsRes.error || profilesRes.error;

    if (firstError) {
      setError(firstError.message);
      setLoading(false);
      return;
    }

    setPackages(packagesRes.data ?? []);
    setDestinations(destinationsRes.data ?? []);
    setReels(reelsRes.data ?? []);
    setProfiles(profilesRes.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    if (!packages || !destinations || !reels || !profiles) return null;

    const activePackages = packages.filter((p) => p.status === "published").length;
    const featuredDestinations = destinations.filter((d) => d.is_featured).length;
    const activeReels = reels.filter((r) => r.is_active).length;
    const newCustomers = profiles.filter((p) => isSameMonth(p.created_at)).length;

    const byCategory: Record<CategorySlug, number> = {
      solo: 0,
      group: 0,
      family: 0,
      international: 0,
    };
    packages.forEach((p) => {
      if (p.category && p.category in byCategory) {
        byCategory[p.category as CategorySlug] += 1;
      }
    });

    const recentPackages = packages.slice(0, 5);
    const recentCustomers = profiles.slice(0, 5);

    const missingImage = packages.filter((p) => !p.image).length;
    const missingCategory = packages.filter((p) => !p.category).length;
    const draftPackages = packages.filter((p) => p.status === "draft").length;
    const inactiveReels = reels.filter((r) => !r.is_active).length;
    const referencedDestinationIds = new Set(
      packages.map((p) => p.destination_id).filter((id): id is string => Boolean(id))
    );
    const destinationsWithNoPackages = destinations.filter(
      (d) => !referencedDestinationIds.has(d.id)
    ).length;

    const activity: ActivityItem[] = [];
    packages.forEach((p) => {
      activity.push({
        key: `pkg-added-${p.id}`,
        label: "Package added",
        title: p.title,
        at: p.created_at ?? new Date().toISOString(),
        section: "packages",
      });
      if (
        p.updated_at &&
        p.created_at &&
        new Date(p.updated_at).getTime() - new Date(p.created_at).getTime() > 60_000
      ) {
        activity.push({
          key: `pkg-updated-${p.id}`,
          label: "Package updated",
          title: p.title,
          at: p.updated_at,
          section: "packages",
        });
      }
    });
    destinations.forEach((d) => {
      if (!d.created_at) return;
      activity.push({
        key: `dest-added-${d.id}`,
        label: "Destination added",
        title: d.name,
        at: d.created_at,
        section: "destinations",
      });
    });
    reels.forEach((r) => {
      if (!r.created_at) return;
      activity.push({
        key: `reel-added-${r.id}`,
        label: "Reel uploaded",
        title: r.title,
        at: r.created_at,
        section: "reels",
      });
    });
    profiles.forEach((p) => {
      if (!p.created_at) return;
      activity.push({
        key: `customer-${p.id}`,
        label: "Customer registered",
        title: p.full_name ?? p.email,
        at: p.created_at,
        section: "customers",
      });
    });
    activity.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

    return {
      activePackages,
      featuredDestinations,
      activeReels,
      newCustomers,
      byCategory,
      recentPackages,
      recentCustomers,
      missingImage,
      missingCategory,
      draftPackages,
      inactiveReels,
      destinationsWithNoPackages,
      activity: activity.slice(0, 6),
    };
  }, [packages, destinations, reels, profiles]);

  const kpis = [
    {
      label: "Destinations",
      value: destinations?.length,
      icon: MapPin,
      context: stats ? `${stats.featuredDestinations} featured` : undefined,
    },
    {
      label: "Packages",
      value: packages?.length,
      icon: Package,
      context: stats ? `${stats.activePackages} active` : undefined,
    },
    {
      label: "Customers",
      value: profiles?.length,
      icon: Users,
      context: stats && stats.newCustomers > 0 ? `+${stats.newCustomers} this month` : undefined,
    },
    {
      label: "Reels",
      value: reels?.length,
      icon: Clapperboard,
      context: stats ? `${stats.activeReels} active` : undefined,
    },
  ];

  const attentionItems = stats
    ? [
        {
          key: "missing-image",
          count: stats.missingImage,
          label: `package${stats.missingImage === 1 ? "" : "s"} missing images`,
          icon: ImageOff,
          section: "packages" as AdminSection,
        },
        {
          key: "missing-category",
          count: stats.missingCategory,
          label: `package${stats.missingCategory === 1 ? "" : "s"} missing a category`,
          icon: Tag,
          section: "packages" as AdminSection,
        },
        {
          key: "draft-packages",
          count: stats.draftPackages,
          label: `package${stats.draftPackages === 1 ? "" : "s"} still in draft`,
          icon: FileWarning,
          section: "packages" as AdminSection,
        },
        {
          key: "inactive-reels",
          count: stats.inactiveReels,
          label: `reel${stats.inactiveReels === 1 ? "" : "s"} inactive`,
          icon: Clapperboard,
          section: "reels" as AdminSection,
        },
        {
          key: "empty-destinations",
          count: stats.destinationsWithNoPackages,
          label: `destination${stats.destinationsWithNoPackages === 1 ? "" : "s"} with no packages`,
          icon: Compass,
          section: "destinations" as AdminSection,
        },
      ].filter((item) => item.count > 0)
    : [];

  const maxCategoryCount = stats
    ? Math.max(1, ...categories.map((cat) => stats.byCategory[cat.id]))
    : 1;

  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader
        title="Dashboard"
        description="Quick summary of your travel inventory and customer base."
        action={
          <AdminButton variant="secondary" onClick={loadDashboard} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </AdminButton>
        }
      />

      {error && (
        <AdminCard className="border-admin-danger/30 bg-admin-danger-soft text-admin-danger p-3 text-xs">
          Failed to load dashboard data: {error}
        </AdminCard>
      )}

      {/* KPI cards in 1 row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((card) => {
          const Icon = card.icon;
          return (
            <AdminCard key={card.label} className="p-3.5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-admin-ink-muted">
                <span className="truncate">{card.label}</span>
                <Icon className="h-4 w-4 shrink-0 text-admin-primary" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <p className="text-2xl font-bold text-admin-ink">
                  {loading || card.value === undefined ? "—" : card.value}
                </p>
                {card.context && (
                  <span className="text-[11px] font-medium text-admin-ink-muted">{card.context}</span>
                )}
              </div>
            </AdminCard>
          );
        })}
      </div>

      {/* Main Grid: Split 7/5 columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Column: Category breakdown & Recent Packages */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          {/* Packages by Category */}
          <AdminCard className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-admin-ink-muted mb-3">
              Packages by Category
            </h3>
            {loading ? (
              <p className="text-xs text-admin-ink-muted">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {categories.map((cat) => {
                  const count = stats?.byCategory[cat.id] ?? 0;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onNavigate("packages")}
                      className="flex flex-col justify-between rounded-xl border border-admin-border bg-admin-surface-2 p-2.5 text-left transition hover:border-admin-primary/40 hover:bg-admin-primary-soft/30"
                    >
                      <span className="text-xs font-medium text-admin-ink-muted truncate">{cat.label}</span>
                      <span className="mt-1 text-lg font-bold text-admin-ink">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </AdminCard>

          {/* Recently Added Packages */}
          <AdminCard className="flex-1 p-0 overflow-hidden" padded={false}>
            <div className="flex items-center justify-between px-4 pt-3.5 pb-2 border-b border-admin-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-admin-ink-muted">
                Recently Added Packages
              </h3>
              <button
                type="button"
                onClick={() => onNavigate("packages")}
                className="flex items-center gap-1 text-xs font-semibold text-admin-primary hover:underline"
              >
                View All <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-admin-border">
              {loading ? (
                <p className="px-4 py-4 text-xs text-admin-ink-muted">Loading packages...</p>
              ) : !stats || stats.recentPackages.length === 0 ? (
                <p className="px-4 py-4 text-xs text-admin-ink-muted">No packages added yet.</p>
              ) : (
                stats.recentPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-admin-surface-2/50 transition">
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-admin-surface-2">
                      {pkg.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={pkg.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-admin-ink-muted">
                          <Package className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-admin-ink">{pkg.title}</p>
                      <p className="truncate text-[11px] text-admin-ink-muted">
                        {pkg.category && pkg.category in categoryLabels
                          ? categoryLabels[pkg.category as CategorySlug]
                          : pkg.category ?? "Uncategorized"}
                        {pkg.destinations?.[0]?.name ? ` · ${pkg.destinations[0].name}` : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-bold text-admin-ink">
                        {pkg.price != null ? formatPrice(pkg.price) : "—"}
                      </p>
                      <AdminBadge
                        className={
                          pkg.status === "draft" ? "bg-admin-accent-soft text-admin-accent" : undefined
                        }
                      >
                        {pkg.status === "draft" ? "Draft" : "Published"}
                      </AdminBadge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AdminCard>
        </div>

        {/* Right Column: Quick Actions + Attention + Activity */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          {/* Quick Actions */}
          <AdminCard className="p-3.5 sm:p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-admin-ink-muted mb-2.5">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <AdminButton onClick={() => onNavigate("packages")} className="w-full text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Package
              </AdminButton>
              <AdminButton variant="secondary" onClick={() => onNavigate("destinations")} className="w-full text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Dest.
              </AdminButton>
              <AdminButton variant="secondary" onClick={() => onNavigate("reels")} className="w-full text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Reel
              </AdminButton>
              <AdminButton variant="ghost" onClick={() => onNavigate("customers")} className="w-full text-xs">
                <Users className="h-3.5 w-3.5" /> Customers
              </AdminButton>
            </div>
          </AdminCard>

          {/* Attention + Recent Activity side by side or stacked */}
          <AdminCard className="p-4 flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-admin-ink-muted mb-3">
              Needs Attention & Activity
            </h3>
            {loading ? (
              <p className="text-xs text-admin-ink-muted">Loading activity...</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {attentionItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onNavigate(item.section)}
                      className="flex w-full items-center gap-2.5 rounded-lg bg-admin-accent-soft/60 px-3 py-2 text-left transition hover:bg-admin-accent-soft"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-admin-accent" />
                      <Icon className="h-3.5 w-3.5 shrink-0 text-admin-ink-muted" />
                      <span className="text-xs font-medium text-admin-ink truncate">
                        {item.count} {item.label}
                      </span>
                    </button>
                  );
                })}

                {stats?.activity.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onNavigate(item.section)}
                    className="block w-full rounded-lg p-2 text-left transition hover:bg-admin-surface-2"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-admin-ink">
                      <span>{item.label}</span>
                      <span className="text-[10px] font-normal text-admin-ink-muted">{formatRelativeTime(item.at)}</span>
                    </div>
                    <p className="truncate text-xs text-admin-ink-muted">&quot;{item.title}&quot;</p>
                  </button>
                ))}
              </div>
            )}
          </AdminCard>
        </div>
      </div>

      {/* Bottom: Recent Customers */}
      <AdminCard className="p-0 overflow-hidden" padded={false}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-admin-border">
          <h3 className="text-xs font-bold uppercase tracking-wider text-admin-ink-muted">
            Recent Customers
          </h3>
          <button
            type="button"
            onClick={() => onNavigate("customers")}
            className="flex items-center gap-1 text-xs font-semibold text-admin-primary hover:underline"
          >
            View All <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="max-h-40 overflow-y-auto divide-y divide-admin-border">
          {loading ? (
            <p className="px-4 py-3 text-xs text-admin-ink-muted">Loading customers...</p>
          ) : !stats || stats.recentCustomers.length === 0 ? (
            <p className="px-4 py-3 text-xs text-admin-ink-muted">No customers registered yet.</p>
          ) : (
            stats.recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between gap-4 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-admin-ink">
                    {customer.full_name ?? "—"}
                  </p>
                  <p className="truncate text-[11px] text-admin-ink-muted">{customer.email}</p>
                </div>
                <p className="shrink-0 text-[11px] text-admin-ink-muted">
                  {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "—"}
                </p>
              </div>
            ))
          )}
        </div>
      </AdminCard>
    </div>
  );
}
