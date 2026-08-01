"use client";

import { GenericManager } from "./GenericManager";

export function EventsManager() {
  return (
    <GenericManager
      table="events"
      title="Events"
      description="Manage upcoming events shown on the home page."
      createLabel="New event"
      fields={[
        { key: "title", label: "Title", required: true, full: true },
        { key: "date", label: "Date label", required: true },
        { key: "location", label: "Location", required: true },
        { key: "image", label: "Image URL", full: true },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "date", label: "Date" },
        { key: "location", label: "Location" },
      ]}
    />
  );
}
