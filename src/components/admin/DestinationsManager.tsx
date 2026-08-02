"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { createStoragePath } from "@/lib/utils";
import { useToast } from "./Toast";
import { Modal } from "./Modal";
import { ImageUploadField } from "./ImageUploadField";

type Destination = {
  id: string;
  title: string;
  country: string | null;
  categories: string[] | null;
  photo_url: string | null;
  created_at: string | null;
};

type FormState = {
  title: string;
  country: string;
  categories: string;
  photo_url: string;
  photo_file: File | null;
};

const emptyForm: FormState = {
  title: "",
  country: "",
  categories: "",
  photo_url: "",
  photo_file: null,
};

function normalizeCategories(value: string) {
  return value
    .split(",")
    .map((category) => category.trim())
    .filter(Boolean);
}

function formatCategories(categories: string[] | null) {
  return categories?.join(", ") ?? "";
}

export function DestinationsManager() {
  const supabase = createBrowserSupabaseClient();
  const { showToast } = useToast();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  async function loadDestinations() {
    setLoading(true);
    const { data, error } = await supabase
      .from("destinations")
      .select("id,title,country,categories,photo_url,created_at")
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
      title: destination.title ?? "",
      country: destination.country ?? "",
      categories: formatCategories(destination.categories),
      photo_url: destination.photo_url ?? "",
      photo_file: null,
    });
    setShowForm(true);
  }

  async function uploadPhotoFile(file: File | null) {
    if (!file) {
      setForm((f) => ({ ...f, photo_file: null, photo_url: "" }));
      return;
    }

    setUploadingImage(true);
    const filename = createStoragePath("destinations", file);
    const { data, error } = await supabase.storage.from("images").upload(filename, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error || !data?.path) {
      showToast(`Failed to upload image: ${error?.message ?? "Unknown error"}`, "error");
      setUploadingImage(false);
      return;
    }

    const { data: publicData } = await supabase
      .storage
      .from("images")
      .getPublicUrl(data.path);

    if (!publicData?.publicUrl) {
      showToast("Failed to generate image URL", "error");
      setUploadingImage(false);
      return;
    }

    setForm((f) => ({
      ...f,
      photo_file: file,
      photo_url: publicData.publicUrl,
    }));
    setUploadingImage(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      showToast("Title is required.", "error");
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      country: form.country.trim() || null,
      categories: normalizeCategories(form.categories),
      photo_url: form.photo_url.trim() || null,
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
            Manage travel destinations with country, categories, and a hero photo.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-[12px] bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> Add destination
        </button>
      </div>

      {showForm && (
        <Modal
          title={editingId ? "Edit destination" : "Add new destination"}
          description="Enter destination details, upload a photo, and save changes."
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="input"
                  placeholder="Paris, Bali, Kyoto"
                />
              </Field>
              <Field label="Country">
                <input
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  className="input"
                  placeholder="France, Indonesia, Japan"
                />
              </Field>
              <Field label="Categories">
                <input
                  value={form.categories}
                  onChange={(e) => setForm((f) => ({ ...f, categories: e.target.value }))}
                  className="input"
                  placeholder="Family, Group, Couple"
                />
              </Field>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Hero image"
                  imageUrl={form.photo_url}
                  onImageFileChange={uploadPhotoFile}
                  onImageUrlChange={(url) => setForm((f) => ({ ...f, photo_url: url }))}
                />
                {uploadingImage && (
                  <p className="mt-2 text-sm text-text-secondary">Uploading image...</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-[12px] bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Save destination" : "Create destination"}
            </button>
          </form>
        </Modal>
      )}

      <div className="mt-6 overflow-x-auto rounded-[18px] border border-border bg-white">
        <table className="w-full min-w-[min(100%,720px)] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-text-secondary">
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Country</th>
              <th className="px-5 py-4">Categories</th>
              <th className="px-5 py-4">Photo</th>
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
                  <td className="px-5 py-4 font-semibold text-ink">{destination.title}</td>
                  <td className="px-5 py-4 text-ink/80">{destination.country ?? "—"}</td>
                  <td className="px-5 py-4 text-ink/80">
                    {destination.categories?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {destination.categories.map((category) => (
                          <span
                            key={category}
                            className="rounded-full bg-sage-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {destination.photo_url ? (
                      <img
                        src={destination.photo_url}
                        alt={destination.title}
                        className="h-16 w-24 rounded-[14px] object-cover"
                      />
                    ) : (
                      <span className="text-text-secondary">No photo</span>
                    )}
                  </td>
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
