"use client";

import { GenericManager } from "./GenericManager";

export function CollectionsManager() {
  return (
    <GenericManager
      table="seasonal_collections"
      title="Collections"
      description="Manage the seasonal collections tiles shown on the home page."
      createLabel="New collection"
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "image", label: "Image URL", full: true, required: true },
      ]}
      columns={[{ key: "title", label: "Title" }]}
    />
  );
}
