"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { useToast } from "./Toast";

type PackageRow = {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  image: string | null;
  category: string | null;
  duration: string | null;
  pickup: string | null;
  dates: string | null;
  price: number | null;
  original_price: number | null;
  overview: string | null;
  destination_id: string | null;
  is_top_pick: boolean | null;
};

type DestinationOption = { id: string; name: string };

type FormState = {
  slug: string;
  title: string;
  location: string;
  image: string;
  category: string;
  duration: string;
  pickup: string;
  dates: string;
  price: string;
  original_price: string;
  overview: string;
  destination_id: string;
  is_top_pick: boolean;
};

const emptyForm: FormState = {
  slug: "",
  title: "",
  location: "",
  image: "",
  category: "",
  duration: "",
  pickup: "",
  dates: "",
  price: "",
  original_price: "",
  overview: "",
  destination_id: "",
  is_top_pick: false,
};

export function PackagesManager() {
  const supabase = createBrowserSupabaseClient();
  const { showToast } = useToast();

  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);
    const [packagesRes, destinationsRes] = await Promise.all([
      supabase.from("packages").select("*").order("created_at", { ascending: false }),
      supabase.from("destinations").select("id,name").order("name"),
    ]);

    if (packagesRes.error) {
      showToast(`Failed to load packages: ${packagesRes.error.message}`, "error");
    } else {
      setPackages(packagesRes.data ?? []);
    }

    if (destinationsRes.error) {
      showToast(`Failed to load destinations: ${destinationsRes.error.message}`, "error");
    } else {
      setDestinations(destinationsRes.data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(pkg: PackageRow) {
    setEditingId(pkg.id);
    setForm({
      slug: pkg.slug ?? "",
      title: pkg.title ?? "",
      location: pkg.location ?? "",
      image: pkg.image ?? "",
      category: pkg.category ?? "",
      duration: pkg.duration ?? "",
      pickup: pkg.pickup ?? "",
      dates: pkg.dates ?? "",
      price: pkg.price?.toString() ?? "",
      original_price: pkg.original_price?.toString() ?? "",
      overview: pkg.overview ?? "",
      destination_id: pkg.destination_id ?? "",
      is_top_pick: pkg.is_top_pick ?? false,
    });
    setShowForm(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim() || !form.slug.trim()) {
      showToast("Title and slug are required.", "error");
      return;
    }

    setSaving(true);

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      location: form.location.trim() || null,
      image: form.image.trim() || null,
      category: form.category.trim() || null,
      duration: form.duration.trim() || null,
      pickup: form.pickup.trim() || null,
      dates: form.dates.trim() || null,
      price: form.price ? Number(form.price) : null,
      original_price: form.original_price ? Number(form.original_price) : null,
      overview: form.overview.trim() || null,
      destination_id: form.destination_id || null,
      is_top_pick: form.is_top_pick,
    };

    const { error } = editingId
      ? await supabase.from("packages").update(payload).eq("id", editingId)
      : await supabase.from("packages").insert([payload]);

    setSaving(false);

    if (error) {
      showToast(`Failed to save package: ${error.message}`, "error");
      return;
    }

    showToast(editingId ? "Package updated." : "Package created.");
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    loadData();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this package? This cannot be undone.")) return;

    const { error } = await supabase.from("packages").delete().eq("id", id);

    if (error) {
      showToast(`Failed to delete package: ${error.message}`, "error");
      return;
    }

    showToast("Package deleted.");
    loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-ink">Packages</h3>
          <p className="mt-1 text-sm text-ink/60">
            Manage package listings, pricing, and their linked destination.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> New package
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-3xl border border-black/[0.08] bg-surface p-6"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-ink">
              {editingId ? "Edit package" : "New package"}
            </h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-ink/50 hover:text-ink"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Slug">
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Destination">
              <select
                value={form.destination_id}
                onChange={(e) => setForm((f) => ({ ...f, destination_id: e.target.value }))}
                className="input"
              >
                <option value="">— None —</option>
                {destinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Location">
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Category">
              <input
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Duration">
              <input
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                className="input"
                placeholder="e.g. 5D / 4N"
              />
            </Field>
            <Field label="Pickup">
              <input
                value={form.pickup}
                onChange={(e) => setForm((f) => ({ ...f, pickup: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Dates">
              <input
                value={form.dates}
                onChange={(e) => setForm((f) => ({ ...f, dates: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Price">
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Original price">
              <input
                type="number"
                value={form.original_price}
                onChange={(e) => setForm((f) => ({ ...f, original_price: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Image URL" full>
              <input
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Overview" full>
              <textarea
                value={form.overview}
                onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))}
                className="input min-h-[100px]"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-ink/70 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_top_pick}
                onChange={(e) => setForm((f) => ({ ...f, is_top_pick: e.target.checked }))}
                className="h-4 w-4 rounded border-ink/20 text-primary focus:ring-primary"
              />
              Top pick (Top Picks by Dream Travels)
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Create package"}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-3xl border border-black/[0.06] bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/[0.06] text-xs font-semibold uppercase tracking-wide text-ink/40">
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Destination</th>
              <th className="px-5 py-4">Location</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-ink/60">
                  Loading packages...
                </td>
              </tr>
            ) : packages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-ink/60">
                  No packages yet.
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr key={pkg.id} className="border-b border-black/[0.04] last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink">{pkg.title}</p>
                    <p className="text-xs text-ink/40">/{pkg.slug}</p>
                  </td>
                  <td className="px-5 py-4 text-ink/60">
                    {destinations.find((d) => d.id === pkg.destination_id)?.name ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-ink/60">{pkg.location ?? "—"}</td>
                  <td className="px-5 py-4 text-ink/60">
                    {pkg.price != null ? `₹${pkg.price}` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(pkg)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/5 text-ink hover:bg-ink/10"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(pkg.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100"
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
    <label className={`space-y-2 text-sm text-ink/70 ${full ? "sm:col-span-2" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
