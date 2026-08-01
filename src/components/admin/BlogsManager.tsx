"use client";

import { GenericManager } from "./GenericManager";

export function BlogsManager() {
  return (
    <GenericManager
      table="blogs"
      title="Blogs"
      description="Manage travel stories shown on the home page."
      createLabel="New blog post"
      fields={[
        { key: "title", label: "Title", required: true, full: true },
        { key: "category", label: "Category", required: true },
        { key: "read_time", label: "Read time", required: true },
        { key: "author", label: "Author", required: true },
        { key: "date", label: "Date label", required: true },
        { key: "image", label: "Cover image URL", full: true },
        { key: "excerpt", label: "Excerpt", type: "textarea", full: true, required: true },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "author", label: "Author" },
        { key: "date", label: "Date" },
      ]}
    />
  );
}
