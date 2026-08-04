"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { createStoragePath } from "@/lib/utils";
import { useToast } from "./Toast";
import { Modal } from "./Modal";
import { ImageUploadField } from "./ImageUploadField";
import { AdminBadge, AdminButton, AdminCard, AdminField, AdminIconButton, AdminPageHeader, AdminTableState } from "./ui";

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
      <AdminPageHeader
        title="Destinations"
        description="Manage travel destinations with country, categories, and a hero photo."
        action={
          <AdminButton onClick={openCreateForm}>
            <Plus className="h-4 w-4" /> Add destination
          </AdminButton>
        }
      />

      {showForm && (
        <Modal
          title={editingId ? "Edit destination" : "Add new destination"}
          description="Enter destination details, upload a photo, and save changes."
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Title">
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="admin-input"
                  placeholder="Paris, Bali, Kyoto"
                />
              </AdminField>
              <AdminField label="Country">
                <input
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  className="admin-input"
                  placeholder="France, Indonesia, Japan"
                />
              </AdminField>
              <AdminField label="Categories">
                <input
                  value={form.categories}
                  onChange={(e) => setForm((f) => ({ ...f, categories: e.target.value }))}
                  className="admin-input"
                  placeholder="Family, Group, Couple"
                />
              </AdminField>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Hero image"
                  imageUrl={form.photo_url}
                  onImageFileChange={uploadPhotoFile}
                  onImageUrlChange={(url) => setForm((f) => ({ ...f, photo_url: url }))}
                />
                {uploadingImage && (
                  <p className="mt-2 text-sm text-admin-ink-muted">Uploading image...</p>
                )}
              </div>
            </div>

            <AdminButton type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save destination" : "Create destination"}
            </AdminButton>
          </form>
        </Modal>
      )}

      <AdminCard className="mt-6 overflow-x-auto" padded={false}>
        <table className="w-full min-w-[min(100%,720px)] text-left text-sm">
          <thead>
            <tr className="border-b border-admin-border text-xs font-semibold uppercase tracking-wide text-admin-ink-muted">
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Country</th>
              <th className="px-5 py-4">Categories</th>
              <th className="px-5 py-4">Photo</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <AdminTableState colSpan={5}>Loading destinations...</AdminTableState>
            ) : destinations.length === 0 ? (
              <AdminTableState colSpan={5}>No destinations yet.</AdminTableState>
            ) : (
              destinations.map((destination) => (
                <tr key={destination.id} className="border-b border-admin-border last:border-0">
                  <td className="px-5 py-4 font-semibold text-admin-ink">{destination.title}</td>
                  <td className="px-5 py-4 text-admin-ink-2">{destination.country ?? "—"}</td>
                  <td className="px-5 py-4 text-admin-ink-2">
                    {destination.categories?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {destination.categories.map((category) => (
                          <AdminBadge key={category}>{category}</AdminBadge>
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
                      <span className="text-admin-ink-muted">No photo</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <AdminIconButton onClick={() => openEditForm(destination)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </AdminIconButton>
                      <AdminIconButton
                        variant="danger"
                        onClick={() => handleDelete(destination.id)}
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
