"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { createStoragePath } from "@/lib/utils";
import { useToast } from "./Toast";
import { Modal } from "./Modal";
import { ImageUploadField } from "./ImageUploadField";

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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-ink">Packages</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Manage package listings, pricing, and their linked destination.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-[12px] bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> New package
        </button>
      </div>

      {showForm && (
        <Modal
          title={editingId ? "Edit package" : "New package"}
          description="Add or update a package listing with pricing, destination mapping, and images."
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Destination Mapping">
                <select
                  value={form.destination_id}
                  onChange={(e) => setForm((f) => ({ ...f, destination_id: e.target.value }))}
                  className="input"
                >
                  <option value="">Select a destination</option>
                  {destinations.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Package Title">
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="input"
                  placeholder="5-Day Paris Romantic Getaway"
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
              <Field label="Price">
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="input"
                  placeholder="e.g. 35000"
                />
              </Field>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Main image"
                  imageUrl={form.image}
                  onImageFileChange={uploadPackageImage}
                  onImageUrlChange={(url) => setForm((f) => ({ ...f, image: url }))}
                />
                {uploadingImage && (
                  <p className="mt-2 text-sm text-text-secondary">Uploading image...</p>
                )}
              </div>
              <Field label="Additional Images" full>
                <input
                  value={form.additional_images}
                  onChange={(e) => setForm((f) => ({ ...f, additional_images: e.target.value }))}
                  className="input"
                  placeholder="Comma-separated URLs"
                />
              </Field>
              <Field label="Details / Description" full>
                <textarea
                  value={form.overview}
                  onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))}
                  className="input min-h-[100px]"
                  placeholder="Itinerary highlights, inclusions, and pricing details"
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-[12px] bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Save changes" : "Create package"}
            </button>
          </form>
        </Modal>
      )}

      <div className="mt-6 overflow-x-auto rounded-[18px] border border-border bg-white">
        <table className="w-full min-w-[min(100%,720px)] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-text-secondary">
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Destination</th>
              <th className="px-5 py-4">Duration</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-text-secondary">
                  Loading packages...
                </td>
              </tr>
            ) : packages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-text-secondary">
                  No packages yet.
                </td>
              </tr>
            ) : (
              packages.map((pkg) => (
                <tr key={pkg.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4 font-semibold text-ink">{pkg.title}</td>
                  <td className="px-5 py-4 text-ink/80">
                    {destinations.find((d) => d.id === pkg.destination_id)?.name ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-ink/80">{pkg.duration ?? "—"}</td>
                  <td className="px-5 py-4 text-ink/80">
                    {pkg.price != null ? `₹${pkg.price}` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(pkg)}
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-sage-100 text-ink hover:bg-sage-200"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(pkg.id)}
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
