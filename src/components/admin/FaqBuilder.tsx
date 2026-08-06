"use client";

import { Plus, Trash2 } from "lucide-react";
import { AdminIconButton } from "./ui";

export type FaqItem = { question: string; answer: string };

export function FaqBuilder({
  items,
  onChange,
}: {
  items: FaqItem[];
  onChange: (items: FaqItem[]) => void;
}) {
  function updateItem(index: number, field: keyof FaqItem, value: string) {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function addItem() {
    onChange([...items, { question: "", answer: "" }]);
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="rounded-[14px] border border-admin-border p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <input
                value={item.question}
                onChange={(e) => updateItem(index, "question", e.target.value)}
                className="admin-input"
                placeholder="Question"
              />
              <textarea
                value={item.answer}
                onChange={(e) => updateItem(index, "answer", e.target.value)}
                className="admin-input min-h-[70px]"
                placeholder="Answer"
              />
            </div>
            <AdminIconButton type="button" variant="danger" onClick={() => removeItem(index)} aria-label="Remove FAQ">
              <Trash2 className="h-4 w-4" />
            </AdminIconButton>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 text-sm font-semibold text-admin-primary hover:underline"
      >
        <Plus className="h-3.5 w-3.5" /> Add FAQ
      </button>
    </div>
  );
}
