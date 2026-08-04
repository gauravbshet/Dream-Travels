"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, MapPin, Package, Users, LogOut, Menu, X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { cn } from "@/lib/utils";
import type { AdminSection } from "./AdminDashboard";

const navItems: { id: AdminSection; label: string; icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutGrid },
  { id: "destinations", label: "Destinations", icon: MapPin },
  { id: "packages", label: "Packages", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
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
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function handleNavigate(id: AdminSection) {
    onChange(id);
    router.push(`/admin?section=${id}`);
    setMobileOpen(false);
  }

  const initial = userEmail?.[0]?.toUpperCase() ?? "A";

  return (
    <>
      <div className="flex items-center justify-between border-b border-admin-border bg-admin-surface px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-admin-primary text-sm font-semibold text-white">
            D
          </span>
          <span className="text-base font-semibold tracking-[-0.01em] text-admin-ink">
            Dream<span className="text-admin-primary">Travels</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] text-admin-ink hover:bg-admin-surface-2"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] shrink-0 flex-col justify-between overflow-y-auto border-r border-admin-border bg-admin-surface px-4 py-6 shadow-admin-pop transition-transform duration-300 ease-out",
          "lg:static lg:z-auto lg:h-screen lg:w-64 lg:max-w-none lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-admin-primary text-base font-semibold text-white">
                D
              </span>
              <span className="text-lg font-semibold tracking-[-0.01em] text-admin-ink">
                Dream<span className="text-admin-primary">Travels</span>
              </span>
              <span className="ml-1 rounded-full bg-admin-surface-2 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-admin-ink-muted">
                Admin
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] text-admin-ink-muted hover:bg-admin-surface-2 lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-[12px] px-4 py-3 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-admin-primary-soft text-admin-primary"
                      : "text-admin-ink-muted hover:bg-admin-surface-2 hover:text-admin-ink"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 flex items-center gap-3 border-t border-admin-border px-2 pt-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-admin-primary-soft text-sm font-semibold text-admin-primary">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-admin-ink">{userEmail ?? "Admin"}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-admin-ink-muted hover:text-admin-danger"
            >
              <LogOut className="h-3.5 w-3.5" /> Log out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
