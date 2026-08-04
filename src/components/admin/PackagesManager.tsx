"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { createStoragePath } from "@/lib/utils";
import { useToast } from "./Toast";
import { Modal } from "./Modal";
import { ImageUploadField } from "./ImageUploadField";
import { AdminButton, AdminCard, AdminField, AdminIconButton, AdminPageHeader, AdminTableState } from "./ui";

type PackageRow = {
  id: string;
  title: string;
  destination_id: string | null;
  duration: string | null;
  price: number | null;
  overview: string | null;
  image: string | null;
  additional_images: string[] | null;
};

type DestinationOption = { id: string; name: string };

type FormState = {
  title: string;
  destination_id: string;
  duration: string;
  price: string;
  overview: string;
  image: string;
  image_file: File | null;
  additional_images: string;
};

const emptyForm: FormState = {
  title: "",
  destination_id: "",
  duration: "",
  price: "",
  overview: "",
  image: "",
  image_file: null,
  additional_images: "",
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
  const [uploadingImage, setUploadingImage] = useState(false);

  async function loadData() {
    setLoading(true);
    const [packagesRes, destinationsRes] = await Promise.all([
      supabase
        .from("packages")
        .select("id,title,duration,price,overview,image,additional_images,destination_id")
        .order("created_at", { ascending: false }),
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
      title: pkg.title ?? "",
      destination_id: pkg.destination_id ?? "",
      duration: pkg.duration ?? "",
      price: pkg.price?.toString() ?? "",
      overview: pkg.overview ?? "",
      image: pkg.image ?? "",
      image_file: null,
      additional_images: pkg.additional_images?.join(", ") ?? "",
    });
    setShowForm(true);
  }

  async function uploadPackageImage(file: File | null) {
    if (!file) {
      setForm((f) => ({ ...f, image_file: null, image: "" }));
      return;
    }

    setUploadingImage(true);
    const filename = createStoragePath("packages", file);
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
      image_file: file,
      image: publicData.publicUrl,
    }));
    setUploadingImage(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      showToast("Package title is required.", "error");
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      destination_id: form.destination_id || null,
      duration: form.duration.trim() || null,
      price: form.price ? Number(form.price) : null,
      overview: form.overview.trim() || null,
      image: form.image.trim() || null,
      additional_images: form.additional_images
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
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
      <AdminPageHeader
        title="Packages"
        description="Manage package listings, pricing, and their linked destination."
        action={
          <AdminButton onClick={openCreateForm}>
            <Plus className="h-4 w-4" /> New package
          </AdminButton>
        }
      />

      {showForm && (
        <Modal
          title={editingId ? "Edit package" : "New package"}
          description="Add or update a package listing with pricing, destination mapping, and images."
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Destination Mapping">
                <select
                  value={form.destination_id}
                  onChange={(e) => setForm((f) => ({ ...f, destination_id: e.target.value }))}
                  className="admin-input"
                >
                  <option value="">Select a destination</option>
                  {destinations.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name}
                    </option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Package Title">
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="admin-input"
                  placeholder="5-Day Paris Romantic Getaway"
                />
              </AdminField>
              <AdminField label="Duration">
                <input
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. 5D / 4N"
                />
              </AdminField>
              <AdminField label="Price">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. 35000"
                />
              </AdminField>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Main image"
                  imageUrl={form.image}
                  onImageFileChange={uploadPackageImage}
                  onImageUrlChange={(url) => setForm((f) => ({ ...f, image: url }))}
                />
                {uploadingImage && (
                  <p className="mt-2 text-sm text-admin-ink-muted">Uploading image...</p>
                )}
              </div>
              <AdminField label="Additional Images" full>
                <input
                  value={form.additional_images}
                  onChange={(e) => setForm((f) => ({ ...f, additional_images: e.target.value }))}
                  className="admin-input"
                  placeholder="Comma-separated URLs"
                />
              </AdminField>
              <AdminField label="Details / Description" full>
                <textarea
                  value={form.overview}
                  onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))}
                  className="admin-input min-h-[100px]"
                  placeholder="Itinerary highlights, inclusions, and pricing details"
                />
              </AdminField>
            </div>

            <AdminButton type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Create package"}
            </AdminButton>
          </form>
        </Modal>
      )}

      <AdminCard className="mt-6 overflow-x-auto" padded={false}>
        <table className="w-full min-w-[min(100%,720px)] text-left text-sm">
          <thead>
            <tr className="border-b border-admin-border text-xs font-semibold uppercase tracking-wide text-admin-ink-muted">
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Destination</th>
              <th className="px-5 py-4">Duration</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <AdminTableState colSpan={5}>Loading packages...</AdminTableState>
            ) : packages.length === 0 ? (
              <AdminTableState colSpan={5}>No packages yet.</AdminTableState>
            ) : (
              packages.map((pkg) => (
                <tr key={pkg.id} className="border-b border-admin-border last:border-0">
                  <td className="px-5 py-4 font-semibold text-admin-ink">{pkg.title}</td>
                  <td className="px-5 py-4 text-admin-ink-2">
                    {destinations.find((d) => d.id === pkg.destination_id)?.name ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-admin-ink-2">{pkg.duration ?? "—"}</td>
                  <td className="px-5 py-4 text-admin-ink-2">
                    {pkg.price != null ? `₹${pkg.price}` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <AdminIconButton onClick={() => openEditForm(pkg)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </AdminIconButton>
                      <AdminIconButton
                        variant="danger"
                        onClick={() => handleDelete(pkg.id)}
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
