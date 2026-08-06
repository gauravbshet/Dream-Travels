"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { useToast } from "./Toast";
import { AdminButton, AdminCard, AdminField, AdminIconButton, AdminTableState } from "./ui";

type ItineraryRow = {
  id: string;
  package_id: string;
  day: number;
  title: string;
  description: string | null;
  stay_location: string | null;
  stay_type: string | null;
  meals: string | null;
  image: string | null;
  optional_note: string | null;
};

type PackageOption = { id: string; title: string };

type FormState = {
  package_id: string;
  day: string;
  title: string;
  description: string;
  stay_location: string;
  stay_type: string;
  meals: string;
  image: string;
  optional_note: string;
};

const emptyForm: FormState = {
  package_id: "",
  day: "",
  title: "",
  description: "",
  stay_location: "",
  stay_type: "",
  meals: "",
  image: "",
  optional_note: "",
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
      stay_location: item.stay_location ?? "",
      stay_type: item.stay_type ?? "",
      meals: item.meals ?? "",
      image: item.image ?? "",
      optional_note: item.optional_note ?? "",
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
      stay_location: form.stay_location.trim() || null,
      stay_type: form.stay_type.trim() || null,
      meals: form.meals.trim() || null,
      image: form.image.trim() || null,
      optional_note: form.optional_note.trim() || null,
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
          <h3 className="text-xl font-semibold text-admin-ink">Itineraries</h3>
          <p className="mt-1 text-sm text-admin-ink-muted">
            Add day-by-day itinerary entries — title, description, stay, and meals — linked to a package.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPackageId}
            onChange={(e) => setSelectedPackageId(e.target.value)}
            className="admin-input w-auto"
          >
            <option value="">All packages</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.title}
              </option>
            ))}
          </select>
          <AdminButton onClick={openCreateForm}>
            <Plus className="h-4 w-4" /> New day
          </AdminButton>
        </div>
      </div>

      {showForm && (
        <AdminCard className="mt-6" padded={false}>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-admin-ink">
                {editingId ? "Edit itinerary item" : "New itinerary item"}
              </h4>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-admin-ink-muted hover:text-admin-ink"
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <AdminField label="Package">
                <select
                  value={form.package_id}
                  onChange={(e) => setForm((f) => ({ ...f, package_id: e.target.value }))}
                  className="admin-input"
                >
                  <option value="">Select a package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title}
                    </option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Day">
                <input
                  type="number"
                  min={1}
                  value={form.day}
                  onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
                  className="admin-input"
                />
              </AdminField>
              <AdminField label="Title" full>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Arrival in Dimapur"
                />
              </AdminField>
              <AdminField label="Description" full>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="admin-input min-h-[100px]"
                />
              </AdminField>
              <AdminField label="Stay location">
                <input
                  value={form.stay_location}
                  onChange={(e) => setForm((f) => ({ ...f, stay_location: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Kohima"
                />
              </AdminField>
              <AdminField label="Stay type">
                <input
                  value={form.stay_type}
                  onChange={(e) => setForm((f) => ({ ...f, stay_type: e.target.value }))}
                  className="admin-input"
                  placeholder="Hotel, Resort, Camp, Homestay"
                />
              </AdminField>
              <AdminField label="Meals">
                <input
                  value={form.meals}
                  onChange={(e) => setForm((f) => ({ ...f, meals: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Breakfast + Dinner"
                />
              </AdminField>
              <AdminField label="Optional note">
                <input
                  value={form.optional_note}
                  onChange={(e) => setForm((f) => ({ ...f, optional_note: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Optional trek (extra charges)"
                />
              </AdminField>
              <AdminField label="Day image URL" full>
                <input
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="admin-input"
                  placeholder="https://..."
                />
              </AdminField>
            </div>

            <AdminButton type="submit" disabled={saving} className="mt-6">
              {saving ? "Saving..." : editingId ? "Save changes" : "Create itinerary item"}
            </AdminButton>
          </form>
        </AdminCard>
      )}

      <AdminCard className="mt-6 overflow-x-auto" padded={false}>
        <table className="w-full min-w-[min(100%,720px)] text-left text-sm">
          <thead>
            <tr className="border-b border-admin-border text-xs font-semibold uppercase tracking-wide text-admin-ink-muted">
              <th className="px-5 py-4">Day</th>
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Package</th>
              <th className="px-5 py-4">Stay</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <AdminTableState colSpan={5}>Loading itineraries...</AdminTableState>
            ) : visibleItineraries.length === 0 ? (
              <AdminTableState colSpan={5}>No itinerary items yet.</AdminTableState>
            ) : (
              visibleItineraries.map((item) => (
                <tr key={item.id} className="border-b border-admin-border last:border-0">
                  <td className="px-5 py-4 font-semibold text-admin-primary">Day {item.day}</td>
                  <td className="px-5 py-4 font-semibold text-admin-ink">{item.title}</td>
                  <td className="px-5 py-4 text-admin-ink-2">{packageTitle(item.package_id)}</td>
                  <td className="px-5 py-4 text-admin-ink-2">{item.stay_location ?? "—"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <AdminIconButton onClick={() => openEditForm(item)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </AdminIconButton>
                      <AdminIconButton
                        variant="danger"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </AdminIconButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminCard>
    </div>
  );
}
