"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { useToast } from "./Toast";

type Destination = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  image: string | null;
  price: number | null;
  rating: number | null;
  is_featured: boolean | null;
};

type FormState = {
  slug: string;
  name: string;
  description: string;
  cover_image: string;
  image: string;
  price: string;
  rating: string;
  is_featured: boolean;
};

const emptyForm: FormState = {
  slug: "",
  name: "",
  description: "",
  cover_image: "",
  image: "",
  price: "",
  rating: "",
  is_featured: false,
};

export function DestinationsManager() {
  const supabase = createBrowserSupabaseClient();
  const { showToast } = useToast();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadDestinations() {
    setLoading(true);
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      showToast(`Failed to load destinations: ${error.message}`, "error");
    } else {
      setDestinations(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadDestinations();
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(destination: Destination) {
    setEditingId(destination.id);
    setForm({
      slug: destination.slug ?? "",
      name: destination.name ?? "",
      description: destination.description ?? "",
      cover_image: destination.cover_image ?? "",
      image: destination.image ?? "",
      price: destination.price?.toString() ?? "",
      rating: destination.rating?.toString() ?? "",
      is_featured: destination.is_featured ?? false,
    });
    setShowForm(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.slug.trim()) {
      showToast("Name and slug are required.", "error");
      return;
    }

    setSaving(true);

    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      description: form.description.trim() || null,
      cover_image: form.cover_image.trim() || null,
      image: form.image.trim() || null,
      price: form.price ? Number(form.price) : null,
      rating: form.rating ? Number(form.rating) : null,
      is_featured: form.is_featured,
    };

    const { error } = editingId
      ? await supabase.from("destinations").update(payload).eq("id", editingId)
      : await supabase.from("destinations").insert([payload]);

    setSaving(false);

    if (error) {
      showToast(`Failed to save destination: ${error.message}`, "error");
      return;
    }

    showToast(editingId ? "Destination updated." : "Destination created.");
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    loadDestinations();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this destination? This cannot be undone.")) return;

    const { error } = await supabase.from("destinations").delete().eq("id", id);

    if (error) {
      showToast(`Failed to delete destination: ${error.message}`, "error");
      return;
    }

    showToast("Destination deleted.");
    loadDestinations();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-ink">Destinations</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Manage the destinations shown on the home page and detail pages.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-[12px] bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> New destination
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-[18px] border border-border bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-ink">
              {editingId ? "Edit destination" : "New destination"}
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
            <Field label="Name">
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
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
            <Field label="Price">
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Rating">
              <input
                type="number"
                step="0.1"
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Cover image URL">
              <input
                value={form.cover_image}
                onChange={(e) => setForm((f) => ({ ...f, cover_image: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Image URL">
              <input
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
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
            <label className="flex items-center gap-2 text-sm text-ink/80 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              Featured on home page (Recommended Destinations)
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-[12px] bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Create destination"}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-[18px] border border-border bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-text-secondary">
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Slug</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Rating</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-text-secondary">
                  Loading destinations...
                </td>
              </tr>
            ) : destinations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-text-secondary">
                  No destinations yet.
                </td>
              </tr>
            ) : (
              destinations.map((destination) => (
                <tr key={destination.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4 font-semibold text-ink">{destination.name}</td>
                  <td className="px-5 py-4 text-text-secondary">/{destination.slug}</td>
                  <td className="px-5 py-4 text-ink/80">
                    {destination.price != null ? `₹${destination.price}` : "—"}
                  </td>
                  <td className="px-5 py-4 text-ink/80">{destination.rating ?? "—"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(destination)}
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-sage-100 text-ink hover:bg-sage-200"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(destination.id)}
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
