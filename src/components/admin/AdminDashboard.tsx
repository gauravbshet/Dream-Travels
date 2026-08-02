"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToastProvider } from "./Toast";
import { AdminSidebar } from "./AdminSidebar";
import { AdminOverview } from "./AdminOverview";
import { DestinationsManager } from "./DestinationsManager";
import { PackagesManager } from "./PackagesManager";
import { CustomersManager } from "./CustomersManager";

export type AdminSection = "overview" | "destinations" | "packages" | "customers";

export function AdminDashboard({ userEmail }: { userEmail?: string | null }) {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const searchParams = useSearchParams();

  useEffect(() => {
    const section = searchParams.get("section");
    if (
      section === "overview" ||
      section === "destinations" ||
      section === "packages" ||
      section === "customers"
    ) {
      setActiveSection(section);
    }
  }, [searchParams]);

  return (
    <ToastProvider>
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <AdminSidebar active={activeSection} onChange={setActiveSection} userEmail={userEmail} />

        <main className="flex-1 overflow-y-auto bg-surface px-4 py-8 sm:px-8 lg:px-10">
          {activeSection === "overview" && <AdminOverview />}
          {activeSection === "destinations" && <DestinationsManager />}
          {activeSection === "packages" && <PackagesManager />}
          {activeSection === "customers" && <CustomersManager />}
        </main>
      </div>
    </ToastProvider>
  );
}
