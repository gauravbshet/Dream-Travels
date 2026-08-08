"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastProvider } from "./Toast";
import { AdminSidebar } from "./AdminSidebar";
import { AdminOverview } from "./AdminOverview";
import { DestinationsManager } from "./DestinationsManager";
import { PackagesManager } from "./PackagesManager";
import { CustomersManager } from "./CustomersManager";
import { ReelsManager } from "./ReelsManager";

export type AdminSection = "overview" | "destinations" | "packages" | "reels" | "customers";

export function AdminDashboard({ userEmail }: { userEmail?: string | null }) {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const searchParams = useSearchParams();
  const router = useRouter();

  const navigate = useCallback(
    (section: AdminSection) => {
      setActiveSection(section);
      router.push(`/admin?section=${section}`);
    },
    [router]
  );

  useEffect(() => {
    const section = searchParams.get("section");
    if (
      section === "overview" ||
      section === "destinations" ||
      section === "packages" ||
      section === "reels" ||
      section === "customers"
    ) {
      setActiveSection(section);
    }
  }, [searchParams]);

  return (
    <ToastProvider>
      <div className="flex h-screen w-full overflow-hidden bg-admin-bg text-admin-ink flex-col lg:flex-row">
        <AdminSidebar active={activeSection} onChange={setActiveSection} userEmail={userEmail} />

        <main className="flex-1 flex flex-col h-full overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
          {activeSection === "overview" && <AdminOverview onNavigate={navigate} />}
          {activeSection === "destinations" && <DestinationsManager />}
          {activeSection === "packages" && <PackagesManager />}
          {activeSection === "reels" && <ReelsManager />}
          {activeSection === "customers" && <CustomersManager />}
        </main>
      </div>
    </ToastProvider>
  );
}
