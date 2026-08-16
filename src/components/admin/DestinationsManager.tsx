"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { slugify } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { useToast } from "./Toast";
import { Modal } from "./Modal";
import { ImageUploadField } from "./ImageUploadField";
import { AdminBadge, AdminButton, AdminCard, AdminField, AdminIconButton, AdminPageHeader, AdminTableState } from "./ui";

const MAP_REGIONS = ["Himalayas", "Northeast", "West Coast", "Western Ghats", "Islands"] as const;

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
  display_order: number | null;
  lat: number | null;
  lng: number | null;
  region: string | null;
  state: string | null;
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
  display_order: string;
  region: string;
  state: string;
  lat: number | null;
  lng: number | null;
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
  display_order: "0",
  region: "",
  state: "",
  lat: null,
  lng: null,
};

/** Looks up lat/lng (and state, as a fallback) for a place name via the
 * server-side Nominatim proxy. Returns null on any failure - the caller
 * should let the destination save anyway, just without map coordinates. */
async function geocodeDestination(name: string, state: string) {
  const query = state ? `${name}, ${state}, India` : `${name}, India`;
  try {
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data.lat !== "number" || typeof data.lng !== "number") return null;
    return { lat: data.lat as number, lng: data.lng as number, state: data.state as string | null };
  } catch {
    return null;
  }
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
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  const [locating, setLocating] = useState(false);

  async function loadDestinations() {
    setLoading(true);
    const { data, error } = await supabase
      .from("destinations")
      .select(
        "id,slug,name,description,cover_image,image,price,rating,is_featured,created_at,display_order,lat,lng,region,state"
      )
      .order("display_order", { ascending: true })
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
      display_order: destination.display_order?.toString() ?? "0",
      region: destination.region ?? "",
      state: destination.state ?? "",
      lat: destination.lat,
      lng: destination.lng,
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
    try {
      const result = await uploadToCloudinary(file, "destinations");
      setForm((f) => ({ ...f, [field]: result.secure_url, [`${field}_file`]: file }) as FormState);
    } catch (err) {
      showToast(`Failed to upload image: ${err instanceof Error ? err.message : "Unknown error"}`, "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      showToast("Destination name is required.", "error");
      return;
    }

    setSaving(true);

    // Auto-locate on the map: only re-geocode if we don't already have
    // coordinates, or the name/state changed since the last save (a
    // typo fix shouldn't silently keep stale coordinates).
    let lat = form.lat;
    let lng = form.lng;
    let state = form.state.trim();

    const needsGeocode = lat == null || lng == null;
    if (needsGeocode) {
      setLocating(true);
      const result = await geocodeDestination(form.name.trim(), state);
      setLocating(false);

      if (result) {
        lat = result.lat;
        lng = result.lng;
        if (!state && result.state) state = result.state;
      } else {
        showToast(
          "Couldn't auto-locate this destination on the map — it will save without a map pin. You can add coordinates later.",
          "error"
        );
      }
    }

    const payload = {
      name: form.name.trim(),
      slug: (form.slug.trim() || slugify(form.name)) || null,
      description: form.description.trim() || null,
      price: form.price ? Number(form.price) : null,
      rating: form.rating ? Number(form.rating) : null,
      is_featured: form.is_featured,
      image: form.image.trim() || null,
      cover_image: form.cover_image.trim() || null,
      display_order: form.display_order ? Number(form.display_order) : 0,
      region: form.region || null,
      state: state || null,
      lat,
      lng,
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
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, lat: null, lng: null }))}
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
              <AdminField label="Display order (lower shows first)">
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. 1"
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
              <AdminField label="Map region">
                <select
                  value={form.region}
                  onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                  className="admin-input"
                >
                  <option value="">Not shown on map</option>
                  {MAP_REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="State">
                <input
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value, lat: null, lng: null }))}
                  className="admin-input"
                  placeholder="Auto-filled on save if left blank"
                />
              </AdminField>
              {form.region && (
                <div className="sm:col-span-2 rounded-lg bg-admin-surface-2 px-3 py-2 text-xs text-admin-ink-muted">
                  {locating
                    ? "Locating this destination on the map…"
                    : form.lat != null && form.lng != null
                      ? `Map pin set (${form.lat}, ${form.lng}). Edit the name to re-locate.`
                      : "Map pin will be located automatically from the name when you save. Pick a region above for it to appear on the map."}
                </div>
              )}
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

      <AdminCard className="mt-4 flex-1 overflow-hidden" padded={false}>
        <div className="max-h-[calc(100vh-175px)] overflow-y-auto">
          <table className="w-full min-w-[min(100%,720px)] text-left text-xs sm:text-sm">
            <thead className="sticky top-0 z-10 bg-admin-surface-2 border-b border-admin-border">
              <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-ink-muted">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {loading ? (
                <AdminTableState colSpan={7}>Loading destinations...</AdminTableState>
              ) : destinations.length === 0 ? (
                <AdminTableState colSpan={7}>No destinations yet.</AdminTableState>
              ) : (
                destinations.map((destination) => (
                  <tr key={destination.id} className="hover:bg-admin-surface-2/40 transition">
                    <td className="px-4 py-2.5 text-admin-ink-2">{destination.display_order ?? 0}</td>
                    <td className="px-4 py-2.5 font-semibold text-admin-ink">{destination.name}</td>
                    <td className="px-4 py-2.5 text-admin-ink-2">
                      {destination.price != null ? `₹${destination.price}` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-admin-ink-2">{destination.rating ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      {destination.is_featured ? <AdminBadge>Featured</AdminBadge> : "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      {destination.image ? (
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="h-10 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-xs text-admin-ink-muted">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <AdminIconButton onClick={() => openEditForm(destination)} aria-label="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </AdminIconButton>
                        <AdminIconButton
                          variant="danger"
                          onClick={() => handleDelete(destination.id)}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </AdminIconButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
