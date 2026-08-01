"use client";

import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  MapPin,
  Package,
  CalendarRange,
  LogOut,
  Star,
  Newspaper,
  PartyPopper,
  Compass,
  Layers,
  Wallet,
} from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { cn } from "@/lib/utils";
import type { AdminSection } from "./AdminDashboard";

const navItems: { id: AdminSection; label: string; icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutGrid },
  { id: "destinations", label: "Destinations", icon: MapPin },
  { id: "packages", label: "Packages", icon: Package },
  { id: "itineraries", label: "Itineraries", icon: CalendarRange },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "blogs", label: "Blogs", icon: Newspaper },
  { id: "events", label: "Events", icon: PartyPopper },
  { id: "experiences", label: "Experiences", icon: Compass },
  { id: "collections", label: "Collections", icon: Layers },
  { id: "budgetTiers", label: "Budget Tiers", icon: Wallet },
];

export function AdminSidebar({
  active,
  onChange,
  userEmail,
}: {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
  userEmail?: string | null;
}) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initial = userEmail?.[0]?.toUpperCase() ?? "A";

  return (
    <aside className="flex w-full shrink-0 flex-col justify-between border-border bg-white px-4 py-6 lg:h-full lg:w-64 lg:overflow-y-auto lg:border-r">
      <div>
        <div className="flex items-center gap-2 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary text-white font-semibold text-base">
            D
          </span>
          <span className="font-semibold text-lg tracking-[-0.01em] text-ink">
            Dream<span className="text-primary">Travels</span>
          </span>
          <span className="ml-1 rounded-full bg-sage-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
            Admin
          </span>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-[12px] px-4 py-3 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-sage-100 text-primary"
                    : "text-text-secondary hover:bg-sage-100/60 hover:text-ink"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 flex items-center gap-3 border-t border-border px-2 pt-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sm font-semibold text-primary">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{userEmail ?? "Admin"}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-red-600"
          >
            <LogOut className="h-3.5 w-3.5" /> Log out
          </button>
        </div>
      </div>
    </aside>
  );
}
