"use client";

import { useState } from "react";
import { ToastProvider } from "./Toast";
import { AdminSidebar } from "./AdminSidebar";
import { AdminOverview } from "./AdminOverview";
import { DestinationsManager } from "./DestinationsManager";
import { PackagesManager } from "./PackagesManager";
import { ItinerariesManager } from "./ItinerariesManager";
import { ReviewsManager } from "./ReviewsManager";
import { BlogsManager } from "./BlogsManager";
import { EventsManager } from "./EventsManager";
import { ExperiencesManager } from "./ExperiencesManager";
import { CollectionsManager } from "./CollectionsManager";
import { BudgetTiersManager } from "./BudgetTiersManager";

export type AdminSection =
  | "overview"
  | "destinations"
  | "packages"
  | "itineraries"
  | "reviews"
  | "blogs"
  | "events"
  | "experiences"
  | "collections"
  | "budgetTiers";

export function AdminDashboard({ userEmail }: { userEmail?: string | null }) {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  return (
    <ToastProvider>
      <div className="flex min-h-[calc(100vh-6rem)] flex-col lg:flex-row">
        <AdminSidebar active={activeSection} onChange={setActiveSection} userEmail={userEmail} />

        <div className="flex-1 px-4 py-8 sm:px-8 lg:px-10">
          {activeSection === "overview" && <AdminOverview />}
          {activeSection === "destinations" && <DestinationsManager />}
          {activeSection === "packages" && <PackagesManager />}
          {activeSection === "itineraries" && <ItinerariesManager />}
          {activeSection === "reviews" && <ReviewsManager />}
          {activeSection === "blogs" && <BlogsManager />}
          {activeSection === "events" && <EventsManager />}
          {activeSection === "experiences" && <ExperiencesManager />}
          {activeSection === "collections" && <CollectionsManager />}
          {activeSection === "budgetTiers" && <BudgetTiersManager />}
        </div>
      </div>
    </ToastProvider>
  );
}
