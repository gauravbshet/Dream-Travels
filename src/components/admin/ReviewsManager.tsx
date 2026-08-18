"use client";

import { GenericManager } from "./GenericManager";

export function ReviewsManager() {
  return (
    <GenericManager
      table="reviews"
      title="Reviews"
      description="Manage traveller testimonials shown on the home page."
      createLabel="New review"
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "rating", label: "Rating (1-5)", type: "number", required: true },
        { key: "date", label: "Date label", required: true },
        { key: "review", label: "Review", type: "textarea", full: true, required: true },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "rating", label: "Rating" },
        { key: "date", label: "Date" },
        {
          key: "review",
          label: "Review",
          render: (row) => (
            <span className="line-clamp-1 max-w-xs inline-block">{String(row.review ?? "")}</span>
          ),
        },
      ]}
    />
  );
}
