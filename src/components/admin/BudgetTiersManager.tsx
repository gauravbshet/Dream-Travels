"use client";

import { GenericManager } from "./GenericManager";

export function BudgetTiersManager() {
  return (
    <GenericManager
      table="budget_tiers"
      title="Budget tiers"
      description="Manage the budget bands shown in the Budget Friendly section. Counts are computed live from published package prices at or below each limit, and each card links to /packages filtered by that limit."
      createLabel="New budget tier"
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "emoji", label: "Emoji", required: true },
        { key: "price_limit", label: "Price limit (₹)", type: "number", required: true },
      ]}
      orderColumn="price_limit"
      columns={[
        { key: "emoji", label: "Emoji" },
        { key: "title", label: "Title" },
        {
          key: "price_limit",
          label: "Price limit",
          render: (row) => `₹${row.price_limit}`,
        },
      ]}
    />
  );
}
