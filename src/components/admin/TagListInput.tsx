"use client";

import { Plus, Trash2 } from "lucide-react";
import { AdminIconButton } from "./ui";

export function TagListInput({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
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
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            className="admin-input"
            placeholder={placeholder}
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
        <Plus className="h-3.5 w-3.5" /> Add
      </button>
    </div>
  );
}
