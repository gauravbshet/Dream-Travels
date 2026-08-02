"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { useToast } from "./Toast";

type ItineraryRow = {
  id: string;
  package_id: string;
  day: number;
  title: string;
  description: string | null;
};

type PackageOption = { id: string; title: string };

type FormState = {
  package_id: string;
  day: string;
  title: string;
  description: string;
};

const emptyForm: FormState = {
  package_id: "",
  day: "",
  title: "",
  description: "",
};

export function ItinerariesManager() {
  const supabase = createBrowserSupabaseClient();
  const { showToast } = useToast();

  const [itineraries, setItineraries] = useState<ItineraryRow[]>([]);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);
    const [itinerariesRes, packagesRes] = await Promise.all([
      supabase.from("itineraries").select("*").order("day", { ascending: true }),
      supabase.from("packages").select("id,title").order("title"),
    ]);

    if (itinerariesRes.error) {
      showToast(`Failed to load itineraries: ${itinerariesRes.error.message}`, "error");
    } else {
      setItineraries(itinerariesRes.data ?? []);
    }

    if (packagesRes.error) {
      showToast(`Failed to load packages: ${packagesRes.error.message}`, "error");
    } else {
      setPackages(packagesRes.data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm({ ...emptyForm, package_id: selectedPackageId });
    setShowForm(true);
  }

  function openEditForm(item: ItineraryRow) {
    setEditingId(item.id);
    setForm({
      package_id: item.package_id ?? "",
      day: item.day?.toString() ?? "",
      title: item.title ?? "",
      description: item.description ?? "",
    });
    setShowForm(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.package_id || !form.day || !form.title.trim()) {
      showToast("Package, day, and title are required.", "error");
      return;
    }

    setSaving(true);

    const payload = {
      package_id: form.package_id,
      day: Number(form.day),
      title: form.title.trim(),
      description: form.description.trim() || null,
    };

    const { error } = editingId
      ? await supabase.from("itineraries").update(payload).eq("id", editingId)
      : await supabase.from("itineraries").insert([payload]);

    setSaving(false);

    if (error) {
      showToast(`Failed to save itinerary item: ${error.message}`, "error");
      return;
    }

    showToast(editingId ? "Itinerary item updated." : "Itinerary item created.");
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    loadData();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this itinerary item? This cannot be undone.")) return;

    const { error } = await supabase.from("itineraries").delete().eq("id", id);

    if (error) {
      showToast(`Failed to delete itinerary item: ${error.message}`, "error");
      return;
    }

    showToast("Itinerary item deleted.");
    loadData();
  }

  function packageTitle(packageId: string) {
    return packages.find((pkg) => pkg.id === packageId)?.title ?? "Unknown package";
  }

  const visibleItineraries = selectedPackageId
    ? itineraries.filter((item) => item.package_id === selectedPackageId)
    : itineraries;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-ink">Itineraries</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Add day-by-day itinerary entries linked to a package.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPackageId}
            onChange={(e) => setSelectedPackageId(e.target.value)}
            className="input w-auto"
          >
            <option value="">All packages</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.title}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center gap-2 rounded-[12px] bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" /> New day
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-[18px] border border-border bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-ink">
              {editingId ? "Edit itinerary item" : "New itinerary item"}
            </h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-text-secondary hover:text-ink"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Package">
              <select
                value={form.package_id}
                onChange={(e) => setForm((f) => ({ ...f, package_id: e.target.value }))}
                className="input"
              >
                <option value="">Select a package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Day">
              <input
                type="number"
                min={1}
                value={form.day}
                onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Title" full>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Description" full>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="input min-h-[100px]"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-[12px] bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Create itinerary item"}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-[18px] border border-border bg-white">
        <table className="w-full min-w-[min(100%,640px)] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-text-secondary">
              <th className="px-5 py-4">Day</th>
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Package</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-text-secondary">
                  Loading itineraries...
                </td>
              </tr>
            ) : visibleItineraries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-text-secondary">
                  No itinerary items yet.
                </td>
              </tr>
            ) : (
              visibleItineraries.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4 font-semibold text-primary">Day {item.day}</td>
                  <td className="px-5 py-4 font-semibold text-ink">{item.title}</td>
                  <td className="px-5 py-4 text-ink/80">{packageTitle(item.package_id)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(item)}
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-sage-100 text-ink hover:bg-sage-200"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-red-50 text-red-600 hover:bg-red-100"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`space-y-2 text-sm text-ink/80 ${full ? "sm:col-span-2" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
