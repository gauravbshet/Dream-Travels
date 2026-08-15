"use client";

import { Plus, Trash2 } from "lucide-react";
import { AdminIconButton } from "./ui";

// Same list-of-inputs pattern as TagListInput, but for admin-set departure
// dates: each row is a native date picker instead of free text, so what's
// stored is always a real, unambiguous date the booking flow can offer back
// to customers as a fixed choice.
export function AvailableDatesInput({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  function updateItem(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, ""]);
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="date"
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            className="admin-input"
          />
          <AdminIconButton type="button" variant="danger" onClick={() => removeItem(index)} aria-label="Remove">
            <Trash2 className="h-4 w-4" />
          </AdminIconButton>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 text-sm font-semibold text-admin-primary hover:underline"
      >
        <Plus className="h-3.5 w-3.5" /> Add departure date
      </button>
      {items.length === 0 && (
        <p className="text-xs text-admin-muted">
          No fixed dates set — the booking form will show a free date picker instead.
        </p>
      )}
    </div>
  );
}
