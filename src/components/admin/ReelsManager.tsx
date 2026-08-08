"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { createStoragePath, normalizeUrl } from "@/lib/utils";
import { categories as travelCategories } from "@/data/categories";
import { useToast } from "./Toast";
import { Modal } from "./Modal";
import { ImageUploadField } from "./ImageUploadField";
import { VideoUploadField } from "./VideoUploadField";
import { AdminBadge, AdminButton, AdminCard, AdminField, AdminIconButton, AdminPageHeader, AdminTableState } from "./ui";

type ReelRow = {
  id: string;
  title: string;
  destination: string | null;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  instagram_url: string | null;
  category: string | null;
  is_active: boolean | null;
  display_order: number | null;
};

type FormState = {
  title: string;
  destination: string;
  description: string;
  video_url: string;
  video_file: File | null;
  thumbnail_url: string;
  thumbnail_file: File | null;
  instagram_url: string;
  category: string;
  is_active: boolean;
  display_order: string;
};

const emptyForm: FormState = {
  title: "",
  destination: "",
  description: "",
  video_url: "",
  video_file: null,
  thumbnail_url: "",
  thumbnail_file: null,
  instagram_url: "",
  category: "",
  is_active: true,
  display_order: "0",
};

const REEL_COLUMNS =
  "id,title,destination,description,video_url,thumbnail_url,instagram_url,category,is_active,display_order";

export function ReelsManager() {
  const supabase = createBrowserSupabaseClient();
  const { showToast } = useToast();

  const [reels, setReels] = useState<ReelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  async function loadReels() {
    setLoading(true);
    const { data, error } = await supabase
      .from("reels")
      .select(REEL_COLUMNS)
      .order("display_order", { ascending: true });

    if (error) {
      showToast(`Failed to load reels: ${error.message}`, "error");
    } else {
      setReels(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadReels();
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(reel: ReelRow) {
    setEditingId(reel.id);
    setForm({
      title: reel.title ?? "",
      destination: reel.destination ?? "",
      description: reel.description ?? "",
      video_url: reel.video_url ?? "",
      video_file: null,
      thumbnail_url: reel.thumbnail_url ?? "",
      thumbnail_file: null,
      instagram_url: reel.instagram_url ?? "",
      category: reel.category ?? "",
      is_active: reel.is_active ?? true,
      display_order: reel.display_order?.toString() ?? "0",
    });
    setShowForm(true);
  }

  async function uploadReelVideo(file: File | null) {
    if (!file) {
      setForm((f) => ({ ...f, video_file: null, video_url: "" }));
      return;
    }

    setUploadingVideo(true);
    const filename = createStoragePath("reels", file);
    const { data, error } = await supabase.storage.from("images").upload(filename, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error || !data?.path) {
      showToast(`Failed to upload video: ${error?.message ?? "Unknown error"}`, "error");
      setUploadingVideo(false);
      return;
    }

    const { data: publicData } = await supabase.storage.from("images").getPublicUrl(data.path);

    if (!publicData?.publicUrl) {
      showToast("Failed to generate video URL", "error");
      setUploadingVideo(false);
      return;
    }

    setForm((f) => ({ ...f, video_file: file, video_url: publicData.publicUrl }));
    setUploadingVideo(false);
  }

  async function uploadReelThumbnail(file: File | null) {
    if (!file) {
      setForm((f) => ({ ...f, thumbnail_file: null, thumbnail_url: "" }));
      return;
    }

    setUploadingThumbnail(true);
    const filename = createStoragePath("reels", file);
    const { data, error } = await supabase.storage.from("images").upload(filename, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error || !data?.path) {
      showToast(`Failed to upload thumbnail: ${error?.message ?? "Unknown error"}`, "error");
      setUploadingThumbnail(false);
      return;
    }

    const { data: publicData } = await supabase.storage.from("images").getPublicUrl(data.path);

    if (!publicData?.publicUrl) {
      showToast("Failed to generate thumbnail URL", "error");
      setUploadingThumbnail(false);
      return;
    }

    setForm((f) => ({ ...f, thumbnail_file: file, thumbnail_url: publicData.publicUrl }));
    setUploadingThumbnail(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      showToast("Reel title is required.", "error");
      return;
    }

    if (!form.video_url.trim()) {
      showToast("Please upload a video for this reel.", "error");
      return;
    }

    if (!form.category) {
      showToast("Please select a travel category for this reel.", "error");
      return;
    }

    let instagramUrl: string | null = null;
    if (form.instagram_url.trim()) {
      instagramUrl = normalizeUrl(form.instagram_url);
      if (!instagramUrl) {
        showToast("That Instagram URL doesn't look valid — check it and try again.", "error");
        return;
      }
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      destination: form.destination.trim() || null,
      description: form.description.trim() || null,
      video_url: form.video_url.trim(),
      thumbnail_url: form.thumbnail_url.trim() || null,
      instagram_url: instagramUrl,
      category: form.category || null,
      is_active: form.is_active,
      display_order: form.display_order ? Number(form.display_order) : 0,
    };

    const { error } = editingId
      ? await supabase.from("reels").update(payload).eq("id", editingId)
      : await supabase.from("reels").insert([payload]);

    setSaving(false);

    if (error) {
      showToast(`Failed to save reel: ${error.message}`, "error");
      return;
    }

    showToast(editingId ? "Reel updated." : "Reel created.");
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    loadReels();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this reel? This cannot be undone.")) return;

    const { error } = await supabase.from("reels").delete().eq("id", id);

    if (error) {
      showToast(`Failed to delete reel: ${error.message}`, "error");
      return;
    }

    showToast("Reel deleted.");
    loadReels();
  }

  async function handleToggleActive(reel: ReelRow) {
    const { error } = await supabase
      .from("reels")
      .update({ is_active: !reel.is_active })
      .eq("id", reel.id);

    if (error) {
      showToast(`Failed to update reel: ${error.message}`, "error");
      return;
    }

    loadReels();
  }

  function categoryLabel(value: string | null) {
    return travelCategories.find((cat) => cat.id === value)?.label ?? value ?? "—";
  }

  return (
    <div>
      <AdminPageHeader
        title="Reels"
        description="Manage the Travel Reels Showcase that appears on the homepage."
        action={
          <AdminButton onClick={openCreateForm}>
            <Plus className="h-4 w-4" /> New reel
          </AdminButton>
        }
      />

      {showForm && (
        <Modal
          title={editingId ? "Edit reel" : "New reel"}
          description="Reels appear in the homepage Travel Reels Showcase, filterable by travel category."
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Reel Title">
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Weekend Escape to Goa"
                />
              </AdminField>
              <AdminField label="Destination">
                <input
                  value={form.destination}
                  onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Goa"
                />
              </AdminField>
              <AdminField label="Travel Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="admin-input"
                  required
                >
                  <option value="">Select a category</option>
                  {travelCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Display order">
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. 1"
                />
              </AdminField>
              <AdminField label="Instagram Reel URL">
                <input
                  value={form.instagram_url}
                  onChange={(e) => setForm((f) => ({ ...f, instagram_url: e.target.value }))}
                  className="admin-input"
                  placeholder="https://instagram.com/reel/..."
                />
              </AdminField>
              <AdminField label="Status">
                <div className="flex items-center gap-2 pt-2 text-sm text-admin-ink-2">
                  <input
                    id="reel-is-active"
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <label htmlFor="reel-is-active">Active (visible on the site)</label>
                </div>
              </AdminField>
              <AdminField label="Description / caption" full>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="admin-input min-h-[80px]"
                  placeholder="A short caption for this reel"
                />
              </AdminField>
              <div>
                <VideoUploadField
                  label="Reel video"
                  videoUrl={form.video_url}
                  onVideoFileChange={uploadReelVideo}
                  onVideoUrlChange={(url) => setForm((f) => ({ ...f, video_url: url }))}
                  onValidationError={(message) => showToast(message, "error")}
                />
                {uploadingVideo && <p className="mt-2 text-sm text-admin-ink-muted">Uploading video...</p>}
              </div>
              <div>
                <ImageUploadField
                  label="Thumbnail (optional — shown before playback)"
                  imageUrl={form.thumbnail_url}
                  onImageFileChange={uploadReelThumbnail}
                  onImageUrlChange={(url) => setForm((f) => ({ ...f, thumbnail_url: url }))}
                />
                {uploadingThumbnail && (
                  <p className="mt-2 text-sm text-admin-ink-muted">Uploading thumbnail...</p>
                )}
              </div>
            </div>

            <AdminButton type="submit" disabled={saving || uploadingVideo || uploadingThumbnail}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Create reel"}
            </AdminButton>
          </form>
        </Modal>
      )}

      <AdminCard className="mt-6 overflow-x-auto" padded={false}>
        <table className="w-full min-w-[min(100%,960px)] text-left text-sm">
          <thead>
            <tr className="border-b border-admin-border text-xs font-semibold uppercase tracking-wide text-admin-ink-muted">
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Destination</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Order</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <AdminTableState colSpan={6}>Loading reels...</AdminTableState>
            ) : reels.length === 0 ? (
              <AdminTableState colSpan={6}>No reels yet — add your first one.</AdminTableState>
            ) : (
              reels.map((reel) => (
                <tr key={reel.id} className="border-b border-admin-border last:border-0">
                  <td className="px-5 py-4 font-semibold text-admin-ink">{reel.title}</td>
                  <td className="px-5 py-4 text-admin-ink-2">{reel.destination ?? "—"}</td>
                  <td className="px-5 py-4 text-admin-ink-2">{categoryLabel(reel.category)}</td>
                  <td className="px-5 py-4 text-admin-ink-2">{reel.display_order ?? 0}</td>
                  <td className="px-5 py-4">
                    <button type="button" onClick={() => handleToggleActive(reel)}>
                      <AdminBadge
                        className={
                          reel.is_active
                            ? undefined
                            : "bg-admin-danger-soft text-admin-danger"
                        }
                      >
                        {reel.is_active ? "Active" : "Inactive"}
                      </AdminBadge>
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {normalizeUrl(reel.instagram_url ?? "") && (
                        <a
                          href={normalizeUrl(reel.instagram_url ?? "")!}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Open on Instagram"
                          className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-admin-surface-2 text-admin-ink transition hover:bg-admin-primary-soft hover:text-admin-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <AdminIconButton onClick={() => openEditForm(reel)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </AdminIconButton>
                      <AdminIconButton
                        variant="danger"
                        onClick={() => handleDelete(reel.id)}
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
