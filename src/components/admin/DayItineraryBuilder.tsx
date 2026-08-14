"use client";

import { ChevronDown, ChevronUp, Copy, Plus, Trash2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { ImageUploadField } from "./ImageUploadField";
import { AdminField, AdminIconButton } from "./ui";

export type DayFormItem = {
  id: string | null; // existing itinerary row id, null for a day not yet saved
  title: string;
  description: string;
  stay_location: string;
  stay_type: string;
  meals: string;
  image: string;
  optional_note: string;
};

export const emptyDay: DayFormItem = {
  id: null,
  title: "",
  description: "",
  stay_location: "",
  stay_type: "",
  meals: "",
  image: "",
  optional_note: "",
};

export function DayItineraryBuilder({
  days,
  onChange,
}: {
  days: DayFormItem[];
  onChange: (days: DayFormItem[]) => void;
}) {
  function updateDay(index: number, patch: Partial<DayFormItem>) {
    const next = [...days];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function addDay() {
    onChange([...days, { ...emptyDay }]);
  }

  function removeDay(index: number) {
    if (!window.confirm(`Delete Day ${index + 1}? This cannot be undone.`)) return;
    onChange(days.filter((_, i) => i !== index));
  }

  function duplicateDay(index: number) {
    const copy = { ...days[index], id: null };
    const next = [...days];
    next.splice(index + 1, 0, copy);
    onChange(next);
  }

  function moveDay(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= days.length) return;
    const next = [...days];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  async function uploadDayImage(index: number, file: File | null) {
    if (!file) {
      updateDay(index, { image: "" });
      return;
    }

    try {
      const result = await uploadToCloudinary(file, "itinerary-days");
      updateDay(index, { image: result.secure_url });
    } catch (err) {
      window.alert(`Failed to upload day image: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return (
    <div className="space-y-4">
      {days.length === 0 && (
        <p className="rounded-[14px] border border-dashed border-admin-border p-6 text-center text-sm text-admin-ink-muted">
          No days added yet. Start with Day 1.
        </p>
      )}

      {days.map((day, index) => (
        <div key={index} className="rounded-[16px] border border-admin-border bg-admin-surface-2 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-primary text-sm font-bold text-white">
              {index + 1}
            </span>
            <h4 className="flex-1 font-semibold text-admin-ink">Day {index + 1}</h4>
            <div className="flex items-center gap-1.5">
              <AdminIconButton
                type="button"
                onClick={() => moveDay(index, -1)}
                aria-label="Move day up"
                disabled={index === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </AdminIconButton>
              <AdminIconButton
                type="button"
                onClick={() => moveDay(index, 1)}
                aria-label="Move day down"
                disabled={index === days.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </AdminIconButton>
              <AdminIconButton type="button" onClick={() => duplicateDay(index)} aria-label="Duplicate day">
                <Copy className="h-4 w-4" />
              </AdminIconButton>
              <AdminIconButton
                type="button"
                variant="danger"
                onClick={() => removeDay(index)}
                aria-label="Delete day"
              >
                <Trash2 className="h-4 w-4" />
              </AdminIconButton>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <AdminField label="Title" full>
              <input
                value={day.title}
                onChange={(e) => updateDay(index, { title: e.target.value })}
                className="admin-input"
                placeholder="e.g. Welcome to Nagaland — Arrival in Dimapur"
              />
            </AdminField>
            <AdminField label="Description" full>
              <textarea
                value={day.description}
                onChange={(e) => updateDay(index, { description: e.target.value })}
                className="admin-input min-h-[90px]"
                placeholder="What happens on this day"
              />
            </AdminField>
            <AdminField label="Stay location">
              <input
                value={day.stay_location}
                onChange={(e) => updateDay(index, { stay_location: e.target.value })}
                className="admin-input"
                placeholder="e.g. Kohima"
              />
            </AdminField>
            <AdminField label="Stay type">
              <select
                value={day.stay_type}
                onChange={(e) => updateDay(index, { stay_type: e.target.value })}
                className="admin-input"
              >
                <option value="">Select stay type</option>
                <option value="Hotel">Hotel</option>
                <option value="Resort">Resort</option>
                <option value="Camp">Camp</option>
                <option value="Homestay">Homestay</option>
              </select>
            </AdminField>
            <AdminField label="Meals">
              <input
                value={day.meals}
                onChange={(e) => updateDay(index, { meals: e.target.value })}
                className="admin-input"
                placeholder="e.g. Breakfast + Dinner"
              />
            </AdminField>
            <AdminField label="Optional note">
              <input
                value={day.optional_note}
                onChange={(e) => updateDay(index, { optional_note: e.target.value })}
                className="admin-input"
                placeholder="e.g. Optional trek (extra charges)"
              />
            </AdminField>
            <div className="sm:col-span-2">
              <ImageUploadField
                label="Day image (optional)"
                imageUrl={day.image}
                onImageFileChange={(file) => uploadDayImage(index, file)}
                onImageUrlChange={(url) => updateDay(index, { image: url })}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addDay}
        className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-admin-border py-3 text-sm font-semibold text-admin-primary hover:bg-admin-primary-soft"
      >
        <Plus className="h-4 w-4" /> Add day {days.length + 1}
      </button>
    </div>
  );
}
