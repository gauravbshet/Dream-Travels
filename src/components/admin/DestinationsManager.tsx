"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { createStoragePath, slugify } from "@/lib/utils";
import { useToast } from "./Toast";
import { Modal } from "./Modal";
import { ImageUploadField } from "./ImageUploadField";
import { AdminBadge, AdminButton, AdminCard, AdminField, AdminIconButton, AdminPageHeader, AdminTableState } from "./ui";

type Destination = {
  id: string;
  slug: string | null;
  name: string;
  description: string | null;
  cover_image: string | null;
  image: string | null;
  price: number | null;
  rating: number | null;
  is_featured: boolean | null;
  created_at: string | null;
};

type FormState = {
  name: string;
  slug: string;
  description: string;
  price: string;
  rating: string;
  is_featured: boolean;
  image: string;
  image_file: File | null;
  cover_image: string;
  cover_image_file: File | null;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  description: "",
  price: "",
  rating: "",
  is_featured: false,
  image: "",
  image_file: null,
  cover_image: "",
  cover_image_file: null,
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);

  async function loadDestinations() {
    setLoading(true);
    const { data, error } = await supabase
      .from("destinations")
      .select("id,slug,name,description,cover_image,image,price,rating,is_featured,created_at")
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
      name: destination.name ?? "",
      slug: destination.slug ?? "",
      description: destination.description ?? "",
      price: destination.price?.toString() ?? "",
      rating: destination.rating?.toString() ?? "",
      is_featured: destination.is_featured ?? false,
      image: destination.image ?? "",
      image_file: null,
      cover_image: destination.cover_image ?? "",
      cover_image_file: null,
    });
    setShowForm(true);
  }

  async function uploadImage(
    file: File | null,
    field: "image" | "cover_image",
    setUploading: (value: boolean) => void
  ) {
    if (!file) {
      setForm((f) => ({ ...f, [field]: "", [`${field}_file`]: null }) as FormState);
      return;
    }

    setUploading(true);
    const filename = createStoragePath("destinations", file);
    const { data, error } = await supabase.storage.from("images").upload(filename, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error || !data?.path) {
      showToast(`Failed to upload image: ${error?.message ?? "Unknown error"}`, "error");
      setUploading(false);
      return;
    }

    const { data: publicData } = await supabase.storage.from("images").getPublicUrl(data.path);

    if (!publicData?.publicUrl) {
      showToast("Failed to generate image URL", "error");
      setUploading(false);
      return;
    }

    setForm((f) => ({ ...f, [field]: publicData.publicUrl, [`${field}_file`]: file }) as FormState);
    setUploading(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      showToast("Destination name is required.", "error");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: (form.slug.trim() || slugify(form.name)) || null,
      description: form.description.trim() || null,
      price: form.price ? Number(form.price) : null,
      rating: form.rating ? Number(form.rating) : null,
      is_featured: form.is_featured,
      image: form.image.trim() || null,
      cover_image: form.cover_image.trim() || null,
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
        description="Manage travel destinations shown on the home page and destination pages."
        action={
          <AdminButton onClick={openCreateForm}>
            <Plus className="h-4 w-4" /> Add destination
          </AdminButton>
        }
      />

      {showForm && (
        <Modal
          title={editingId ? "Edit destination" : "Add new destination"}
          description="Enter destination details, upload images, and save changes."
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Name">
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="admin-input"
                  placeholder="Paris, Bali, Kyoto"
                />
              </AdminField>
              <AdminField label="Slug">
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="admin-input"
                  placeholder="auto-generated from name if left blank"
                />
              </AdminField>
              <AdminField label="Price">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. 12999"
                />
              </AdminField>
              <AdminField label="Rating">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating}
                  onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. 4.7"
                />
              </AdminField>
              <AdminField label="Featured">
                <div className="flex items-center gap-2 pt-2 text-sm text-admin-ink-2">
                  <input
                    id="destination-is-featured"
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <label htmlFor="destination-is-featured">Show in featured destinations</label>
                </div>
              </AdminField>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Card image"
                  imageUrl={form.image}
                  onImageFileChange={(file) => uploadImage(file, "image", setUploadingImage)}
                  onImageUrlChange={(url) => setForm((f) => ({ ...f, image: url }))}
                />
                {uploadingImage && (
                  <p className="mt-2 text-sm text-admin-ink-muted">Uploading image...</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Cover image (hero banner)"
                  imageUrl={form.cover_image}
                  onImageFileChange={(file) => uploadImage(file, "cover_image", setUploadingCoverImage)}
                  onImageUrlChange={(url) => setForm((f) => ({ ...f, cover_image: url }))}
                />
                {uploadingCoverImage && (
                  <p className="mt-2 text-sm text-admin-ink-muted">Uploading cover image...</p>
                )}
              </div>
              <AdminField label="Description" full>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="admin-input min-h-[100px]"
                  placeholder="Short description shown on the destination page"
                />
              </AdminField>
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
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Rating</th>
              <th className="px-5 py-4">Featured</th>
              <th className="px-5 py-4">Image</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <AdminTableState colSpan={6}>Loading destinations...</AdminTableState>
            ) : destinations.length === 0 ? (
              <AdminTableState colSpan={6}>No destinations yet.</AdminTableState>
            ) : (
              destinations.map((destination) => (
                <tr key={destination.id} className="border-b border-admin-border last:border-0">
                  <td className="px-5 py-4 font-semibold text-admin-ink">{destination.name}</td>
                  <td className="px-5 py-4 text-admin-ink-2">
                    {destination.price != null ? `₹${destination.price}` : "—"}
                  </td>
                  <td className="px-5 py-4 text-admin-ink-2">{destination.rating ?? "—"}</td>
                  <td className="px-5 py-4">
                    {destination.is_featured ? <AdminBadge>Featured</AdminBadge> : "—"}
                  </td>
                  <td className="px-5 py-4">
                    {destination.image ? (
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="h-16 w-24 rounded-[14px] object-cover"
                      />
                    ) : (
                      <span className="text-admin-ink-muted">No image</span>
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
