"use client";

import { GenericManager } from "./GenericManager";

export function ExperiencesManager() {
  return (
    <GenericManager
      table="popular_experiences"
      title="Experiences"
      description="Manage the popular experiences tiles shown on the home page."
      createLabel="New experience"
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "image", label: "Image URL", full: true, required: true },
      ]}
      columns={[{ key: "title", label: "Title" }]}
    />
  );
}
