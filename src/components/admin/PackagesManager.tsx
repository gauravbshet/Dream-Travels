"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { slugify } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { categories as travelCategories, categoryLabels, isCategorySlug } from "@/data/categories";
import { useToast } from "./Toast";
import { Modal } from "./Modal";
import { ImageUploadField } from "./ImageUploadField";
import { TagListInput } from "./TagListInput";
import { AvailableDatesInput } from "./AvailableDatesInput";
import { FaqBuilder, type FaqItem } from "./FaqBuilder";
import { DayItineraryBuilder, emptyDay, type DayFormItem } from "./DayItineraryBuilder";
import { AdminBadge, AdminButton, AdminCard, AdminField, AdminIconButton, AdminPageHeader, AdminTableState } from "./ui";

type PackageRow = {
  id: string;
  slug: string | null;
  title: string;
  destination_id: string | null;
  location: string | null;
  category: string | null;
  pickup: string | null;
  drop_point: string | null;
  dates: string | null;
  available_dates: string[] | null;
  available_from: string | null;
  available_to: string | null;
  duration: string | null;
  price: number | null;
  original_price: number | null;
  rating: number | null;
  reviews: number | null;
  is_top_pick: boolean | null;
  status: string | null;
  overview: string | null;
  image: string | null;
  additional_images: string[] | null;
  highlights: string[] | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
  faq: FaqItem[] | null;
  difficulty: string | null;
  best_time: string | null;
  languages: string[] | null;
  travel_type: string | null;
  max_group_size: number | null;
  transport: string | null;
  accommodation: string | null;
  meals: string | null;
  display_order: number | null;
  slots_left: number | null;
};

type DestinationOption = { id: string; name: string };

type FormState = {
  title: string;
  slug: string;
  destination_id: string;
  location: string;
  category: string;
  pickup: string;
  drop_point: string;
  dates: string;
  available_dates: string[];
  available_from: string;
  available_to: string;
  duration: string;
  price: string;
  original_price: string;
  rating: string;
  reviews: string;
  is_top_pick: boolean;
  status: string;
  overview: string;
  image: string;
  image_file: File | null;
  additional_images: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  faq: FaqItem[];
  difficulty: string;
  best_time: string;
  languages: string;
  travel_type: string;
  max_group_size: string;
  transport: string;
  accommodation: string;
  meals: string;
  display_order: string;
  slots_left: string;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  destination_id: "",
  location: "",
  category: "",
  pickup: "",
  drop_point: "",
  dates: "",
  available_dates: [],
  available_from: "",
  available_to: "",
  duration: "",
  price: "",
  original_price: "",
  rating: "",
  reviews: "",
  is_top_pick: false,
  status: "published",
  overview: "",
  image: "",
  image_file: null,
  additional_images: "",
  highlights: [],
  inclusions: [],
  exclusions: [],
  faq: [],
  difficulty: "",
  best_time: "",
  languages: "",
  travel_type: "",
  max_group_size: "",
  transport: "",
  accommodation: "",
  meals: "",
  display_order: "0",
  slots_left: "",
};

// Pulls the day count out of a duration string like "5D / 4N", "5 Days 4 Nights",
// or just "5". Returns null if nothing recognizable is found.
function parseDayCountFromDuration(duration: string): number | null {
  const match = duration.match(/(\d+)\s*D/i) ?? duration.match(/(\d+)/);
  if (!match) return null;
  const count = Number(match[1]);
  return Number.isFinite(count) && count > 0 ? count : null;
}

const PACKAGE_COLUMNS =
  "id,slug,title,duration,price,original_price,overview,image,additional_images,destination_id,location,category,pickup,drop_point,dates,available_dates,available_from,available_to,rating,reviews,is_top_pick,status,highlights,inclusions,exclusions,faq,difficulty,best_time,languages,travel_type,max_group_size,transport,accommodation,meals,display_order,slots_left";

export function PackagesManager() {
  const supabase = createBrowserSupabaseClient();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    const fromUrl = searchParams.get("category");
    setCategoryFilter(fromUrl && isCategorySlug(fromUrl) ? fromUrl : null);
  }, [searchParams]);

  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [days, setDays] = useState<DayFormItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadingDays, setLoadingDays] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "content" | "itinerary">("details");

  async function loadData() {
    setLoading(true);
    const [packagesRes, destinationsRes] = await Promise.all([
      supabase
        .from("packages")
        .select(PACKAGE_COLUMNS)
        .order("display_order", { ascending: true })
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

  useEffect(() => {
    if (!showForm || loadingDays) return;

    const count = parseDayCountFromDuration(form.duration);
    if (!count) return;

    setDays((prev) => {
      if (count === prev.length) return prev;

      if (count > prev.length) {
        return [...prev, ...Array.from({ length: count - prev.length }, () => ({ ...emptyDay }))];
      }

      return prev.slice(0, count);
    });
  }, [showForm, form.duration, loadingDays]);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setDays([]);
    setActiveTab("details");
    setShowForm(true);
  }

  async function openEditForm(pkg: PackageRow) {
    setEditingId(pkg.id);
    setDays([]);
    setActiveTab("details");
    setForm({
      title: pkg.title ?? "",
      slug: pkg.slug ?? "",
      destination_id: pkg.destination_id ?? "",
      location: pkg.location ?? "",
      category: pkg.category ?? "",
      pickup: pkg.pickup ?? "",
      drop_point: pkg.drop_point ?? "",
      dates: pkg.dates ?? "",
      available_dates: pkg.available_dates ?? [],
      available_from: pkg.available_from ?? "",
      available_to: pkg.available_to ?? "",
      duration: pkg.duration ?? "",
      price: pkg.price?.toString() ?? "",
      original_price: pkg.original_price?.toString() ?? "",
      rating: pkg.rating?.toString() ?? "",
      reviews: pkg.reviews?.toString() ?? "",
      is_top_pick: pkg.is_top_pick ?? false,
      status: pkg.status ?? "published",
      overview: pkg.overview ?? "",
      image: pkg.image ?? "",
      image_file: null,
      additional_images: pkg.additional_images?.join(", ") ?? "",
      highlights: pkg.highlights ?? [],
      inclusions: pkg.inclusions ?? [],
      exclusions: pkg.exclusions ?? [],
      faq: pkg.faq ?? [],
      difficulty: pkg.difficulty ?? "",
      best_time: pkg.best_time ?? "",
      languages: pkg.languages?.join(", ") ?? "",
      travel_type: pkg.travel_type ?? "",
      max_group_size: pkg.max_group_size?.toString() ?? "",
      transport: pkg.transport ?? "",
      accommodation: pkg.accommodation ?? "",
      meals: pkg.meals ?? "",
      display_order: pkg.display_order?.toString() ?? "0",
      slots_left: pkg.slots_left?.toString() ?? "",
    });
    setShowForm(true);

    setLoadingDays(true);
    const { data, error } = await supabase
      .from("itineraries")
      .select("id,day,title,description,stay_location,stay_type,meals,image,optional_note")
      .eq("package_id", pkg.id)
      .order("day", { ascending: true });

    if (error) {
      showToast(`Failed to load itinerary days: ${error.message}`, "error");
    } else {
      type ItineraryDayRow = {
        id: string;
        title: string | null;
        description: string | null;
        stay_location: string | null;
        stay_type: string | null;
        meals: string | null;
        image: string | null;
        optional_note: string | null;
      };

      setDays(
        ((data ?? []) as ItineraryDayRow[]).map((row) => ({
          id: row.id,
          title: row.title ?? "",
          description: row.description ?? "",
          stay_location: row.stay_location ?? "",
          stay_type: row.stay_type ?? "",
          meals: row.meals ?? "",
          image: row.image ?? "",
          optional_note: row.optional_note ?? "",
        }))
      );
    }
    setLoadingDays(false);
  }

  function syncDaysWithDuration() {
    const count = parseDayCountFromDuration(form.duration);
    if (!count) {
      showToast('Enter a duration first, e.g. "5D / 4N".', "error");
      return;
    }

    if (count === days.length) return;

    if (count < days.length) {
      const removed = days.length - count;
      if (
        !window.confirm(
          `Duration says ${count} day(s), but you have ${days.length}. Remove the last ${removed} day(s)?`
        )
      ) {
        return;
      }
      onChangeDaysTrim(count);
      return;
    }

    const toAdd = count - days.length;
    setDays((prev) => [...prev, ...Array.from({ length: toAdd }, () => ({ ...emptyDay }))]);
    showToast(`Added ${toAdd} day${toAdd > 1 ? "s" : ""} to match the ${count}-day duration.`);
  }

  function onChangeDaysTrim(count: number) {
    setDays((prev) => prev.slice(0, count));
  }

  async function uploadPackageImage(file: File | null) {
    if (!file) {
      setForm((f) => ({ ...f, image_file: null, image: "" }));
      return;
    }

    setUploadingImage(true);
    try {
      const result = await uploadToCloudinary(file, "packages");
      setForm((f) => ({
        ...f,
        image_file: file,
        image: result.secure_url,
      }));
    } catch (err) {
      showToast(`Failed to upload image: ${err instanceof Error ? err.message : "Unknown error"}`, "error");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      showToast("Package title is required.", "error");
      return;
    }

    if (!form.destination_id) {
      showToast("Please select a destination for this package.", "error");
      return;
    }

    if (!form.category) {
      showToast("Please select a travel category for this package.", "error");
      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      slug: (form.slug.trim() || slugify(form.title)) || null,
      destination_id: form.destination_id || null,
      location: form.location.trim() || null,
      category: form.category.trim() || null,
      pickup: form.pickup.trim() || null,
      drop_point: form.drop_point.trim() || null,
      dates: form.dates.trim() || null,
      available_dates: (() => {
        const cleaned = form.available_dates.filter(Boolean);
        return cleaned.length > 0 ? cleaned : null;
      })(),
      available_from: form.available_from || null,
      available_to: form.available_to || null,
      duration: form.duration.trim() || null,
      price: form.price ? Number(form.price) : null,
      original_price: form.original_price ? Number(form.original_price) : null,
      rating: form.rating ? Number(form.rating) : null,
      reviews: form.reviews ? Number(form.reviews) : null,
      is_top_pick: form.is_top_pick,
      status: form.status,
      overview: form.overview.trim() || null,
      image: form.image.trim() || null,
      additional_images: form.additional_images
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      highlights: form.highlights.map((item) => item.trim()).filter(Boolean),
      inclusions: form.inclusions.map((item) => item.trim()).filter(Boolean),
      exclusions: form.exclusions.map((item) => item.trim()).filter(Boolean),
      faq: form.faq.filter((item) => item.question.trim() && item.answer.trim()),
      difficulty: form.difficulty.trim() || null,
      best_time: form.best_time.trim() || null,
      languages: form.languages
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      travel_type: form.travel_type.trim() || null,
      max_group_size: form.max_group_size ? Number(form.max_group_size) : null,
      transport: form.transport.trim() || null,
      accommodation: form.accommodation.trim() || null,
      meals: form.meals.trim() || null,
      display_order: form.display_order ? Number(form.display_order) : 0,
      slots_left: form.slots_left !== "" ? Number(form.slots_left) : null,
    };

    const { data: savedPackageData, error } = editingId
      ? await supabase.from("packages").update(payload).eq("id", editingId).select("id").single()
      : await supabase.from("packages").insert([payload]).select("id").single();

    if (error || !savedPackageData) {
      setSaving(false);
      showToast(`Failed to save package: ${error?.message ?? "Unknown error"}`, "error");
      return;
    }

    // Cast needed: the Supabase client has no generated Database type, so
    // TypeScript infers query results as `never` instead of the real row
    // shape. See supabase_schema.md — generating types would remove this.
    const savedPackage = savedPackageData as { id: string };

    // Itinerary days live in a separate table. Simplest consistent approach:
    // replace all days for this package with whatever is currently in the
    // form, in order — avoids diffing inserts/updates/deletes by hand.
    const validDays = days.filter(
      (day) => day.title.trim() || day.description.trim() || day.stay_location.trim()
    );

    const { error: deleteError } = await supabase
      .from("itineraries")
      .delete()
      .eq("package_id", savedPackage.id);

    if (deleteError) {
      setSaving(false);
      showToast(`Package saved, but itinerary update failed: ${deleteError.message}`, "error");
      return;
    }

    if (validDays.length > 0) {
      const { error: itineraryError } = await supabase.from("itineraries").insert(
        validDays.map((day, index) => ({
          package_id: savedPackage.id,
          day: index + 1,
          title: day.title.trim() || `Day ${index + 1}`,
          description: day.description.trim() || null,
          stay_location: day.stay_location.trim() || null,
          stay_type: day.stay_type.trim() || null,
          meals: day.meals.trim() || null,
          image: day.image.trim() || null,
          optional_note: day.optional_note.trim() || null,
        }))
      );

      if (itineraryError) {
        setSaving(false);
        showToast(`Package saved, but itinerary update failed: ${itineraryError.message}`, "error");
        return;
      }
    }

    setSaving(false);
    showToast(editingId ? "Package updated." : "Package created.");
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setDays([]);
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

  const filteredPackages = useMemo(
    () => (categoryFilter ? packages.filter((pkg) => pkg.category === categoryFilter) : packages),
    [packages, categoryFilter]
  );

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

      {categoryFilter && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-admin-ink-2">
            Filtering by <strong className="text-admin-ink">{categoryLabels[categoryFilter as keyof typeof categoryLabels]}</strong>
          </span>
          <button
            type="button"
            onClick={() => setCategoryFilter(null)}
            className="flex items-center gap-1 rounded-full border border-admin-border bg-admin-surface px-2.5 py-1 text-xs font-semibold text-admin-ink-muted hover:bg-admin-surface-2"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        </div>
      )}

      {showForm && (
        <Modal
          title={editingId ? "Edit package" : "New package"}
          description="Everything here feeds the public package page directly — no code changes needed."
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2 border-b border-admin-border">
              {(
                [
                  { key: "details", label: "Details" },
                  { key: "content", label: "Content" },
                  { key: "itinerary", label: `Itinerary${days.length ? ` (${days.length})` : ""}` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${activeTab === tab.key
                      ? "border-admin-accent text-admin-accent"
                      : "border-transparent text-admin-ink-muted hover:text-admin-ink"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={activeTab === "details" ? "grid gap-4 sm:grid-cols-2" : "hidden"}>
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
              <AdminField label="Slug">
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="admin-input"
                  placeholder="auto-generated from title if left blank"
                />
              </AdminField>
              <AdminField label="Status">
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="admin-input"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
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
              <AdminField label="Location (shown on package page)">
                <input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Paris, France"
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
              <AdminField label="Travel type">
                <input
                  value={form.travel_type}
                  onChange={(e) => setForm((f) => ({ ...f, travel_type: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Group, Private, Customizable"
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
              <AdminField label="Pickup point">
                <input
                  value={form.pickup}
                  onChange={(e) => setForm((f) => ({ ...f, pickup: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Cochin Airport (COK)"
                />
              </AdminField>
              <AdminField label="Drop point">
                <input
                  value={form.drop_point}
                  onChange={(e) => setForm((f) => ({ ...f, drop_point: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Cochin Airport (COK)"
                />
              </AdminField>
              <AdminField label="Dates">
                <input
                  value={form.dates}
                  onChange={(e) => setForm((f) => ({ ...f, dates: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Available year-round"
                />
              </AdminField>
              <AdminField label="Available departure dates (booking form picks from these)" full>
                <AvailableDatesInput
                  items={form.available_dates}
                  onChange={(items) => setForm((f) => ({ ...f, available_dates: items }))}
                />
              </AdminField>
              <AdminField label="Available From (Date range)">
                <input
                  type="date"
                  value={form.available_from}
                  onChange={(e) => setForm((f) => ({ ...f, available_from: e.target.value }))}
                  className="admin-input"
                />
              </AdminField>
              <AdminField label="Available To (Date range)">
                <input
                  type="date"
                  value={form.available_to}
                  onChange={(e) => setForm((f) => ({ ...f, available_to: e.target.value }))}
                  className="admin-input"
                />
              </AdminField>
              <AdminField label="Best time to visit">
                <input
                  value={form.best_time}
                  onChange={(e) => setForm((f) => ({ ...f, best_time: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Sep - Mar"
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
              <AdminField label="Original Price (for discount strike-through)">
                <input
                  type="number"
                  value={form.original_price}
                  onChange={(e) => setForm((f) => ({ ...f, original_price: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. 42000"
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
                  placeholder="e.g. 4.8"
                />
              </AdminField>
              <AdminField label="Reviews count">
                <input
                  type="number"
                  min="0"
                  value={form.reviews}
                  onChange={(e) => setForm((f) => ({ ...f, reviews: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. 128"
                />
              </AdminField>
              <AdminField label="Difficulty">
                <input
                  value={form.difficulty}
                  onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Easy, Moderate, Challenging"
                />
              </AdminField>
              <AdminField label="Max group size">
                <input
                  type="number"
                  min="0"
                  value={form.max_group_size}
                  onChange={(e) => setForm((f) => ({ ...f, max_group_size: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. 15"
                />
              </AdminField>
              <AdminField label="Slots Left / Available Seats (shown to users)">
                <input
                  type="number"
                  min="0"
                  value={form.slots_left}
                  onChange={(e) => setForm((f) => ({ ...f, slots_left: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. 4 (enter 0 for Sold Out)"
                />
              </AdminField>
              <AdminField label="Transport">
                <input
                  value={form.transport}
                  onChange={(e) => setForm((f) => ({ ...f, transport: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. AC coach + private cabs"
                />
              </AdminField>
              <AdminField label="Accommodation">
                <input
                  value={form.accommodation}
                  onChange={(e) => setForm((f) => ({ ...f, accommodation: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. 3-star hotels & resorts"
                />
              </AdminField>
              <AdminField label="Meals">
                <input
                  value={form.meals}
                  onChange={(e) => setForm((f) => ({ ...f, meals: e.target.value }))}
                  className="admin-input"
                  placeholder="e.g. Daily breakfast + 2 dinners"
                />
              </AdminField>
              <AdminField label="Languages">
                <input
                  value={form.languages}
                  onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))}
                  className="admin-input"
                  placeholder="Comma-separated, e.g. English, Hindi"
                />
              </AdminField>
              <AdminField label="Top pick">
                <div className="flex items-center gap-2 pt-2 text-sm text-admin-ink-2">
                  <input
                    id="package-is-top-pick"
                    type="checkbox"
                    checked={form.is_top_pick}
                    onChange={(e) => setForm((f) => ({ ...f, is_top_pick: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <label htmlFor="package-is-top-pick">Show as a top pick</label>
                </div>
              </AdminField>
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Main / hero image"
                  imageUrl={form.image}
                  onImageFileChange={uploadPackageImage}
                  onImageUrlChange={(url) => setForm((f) => ({ ...f, image: url }))}
                />
                {uploadingImage && (
                  <p className="mt-2 text-sm text-admin-ink-muted">Uploading image...</p>
                )}
              </div>
              <AdminField label="Gallery images" full>
                <input
                  value={form.additional_images}
                  onChange={(e) => setForm((f) => ({ ...f, additional_images: e.target.value }))}
                  className="admin-input"
                  placeholder="Comma-separated URLs"
                />
              </AdminField>
              <AdminField label="Overview" full>
                <textarea
                  value={form.overview}
                  onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))}
                  className="admin-input min-h-[100px]"
                  placeholder="A rich description of the trip"
                />
              </AdminField>
            </div>

            <div className={activeTab === "content" ? "grid gap-6 sm:grid-cols-2" : "hidden"}>
              <div>
                <p className="mb-2 text-sm font-medium text-admin-ink">Highlights</p>
                <TagListInput
                  items={form.highlights}
                  onChange={(items) => setForm((f) => ({ ...f, highlights: items }))}
                  placeholder="e.g. Sunrise trek to Tiger Hill"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-admin-ink">Inclusions</p>
                <TagListInput
                  items={form.inclusions}
                  onChange={(items) => setForm((f) => ({ ...f, inclusions: items }))}
                  placeholder="e.g. Airport transfers"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-admin-ink">Exclusions</p>
                <TagListInput
                  items={form.exclusions}
                  onChange={(items) => setForm((f) => ({ ...f, exclusions: items }))}
                  placeholder="e.g. Personal expenses"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-admin-ink">FAQs</p>
                <FaqBuilder items={form.faq} onChange={(items) => setForm((f) => ({ ...f, faq: items }))} />
              </div>
            </div>

            <div className={activeTab === "itinerary" ? "" : "hidden"}>
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-admin-ink">Day-wise itinerary</h4>
                  <p className="mt-1 text-sm text-admin-ink-muted">
                    Add each day of the trip — title, description, stay, and meals. The day entries automatically
                    follow the package duration, so entering a 5-day trip creates 5 day blocks for you.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={syncDaysWithDuration}
                  className="whitespace-nowrap rounded-full border border-admin-border px-4 py-2 text-xs font-semibold text-admin-ink hover:bg-admin-surface-2"
                >
                  Match days to duration{form.duration ? ` (${form.duration})` : ""}
                </button>
              </div>
              {loadingDays ? (
                <p className="text-sm text-admin-ink-muted">Loading itinerary...</p>
              ) : (
                <DayItineraryBuilder days={days} onChange={setDays} />
              )}
            </div>

            <AdminButton type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : "Create package"}
            </AdminButton>
          </form>
        </Modal>
      )}

      <AdminCard className="mt-4 flex-1 overflow-hidden" padded={false}>
        <div className="max-h-[calc(100vh-175px)] overflow-y-auto">
          <table className="w-full min-w-[min(100%,960px)] text-left text-xs sm:text-sm">
            <thead className="sticky top-0 z-10 bg-admin-surface-2 border-b border-admin-border">
              <tr className="text-[11px] font-bold uppercase tracking-wider text-admin-ink-muted">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Slots Left</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Top pick</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {loading ? (
                <AdminTableState colSpan={10}>Loading packages...</AdminTableState>
              ) : filteredPackages.length === 0 ? (
                <AdminTableState colSpan={10}>
                  {categoryFilter ? "No packages in this category." : "No packages yet."}
                </AdminTableState>
              ) : (
                filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-admin-surface-2/40 transition">
                    <td className="px-4 py-2.5 text-admin-ink-2">{pkg.display_order ?? 0}</td>
                    <td className="px-4 py-2.5 font-semibold text-admin-ink">{pkg.title}</td>
                    <td className="px-4 py-2.5 text-admin-ink-2">
                      {destinations.find((d) => d.id === pkg.destination_id)?.name ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-admin-ink-2">{pkg.location ?? "—"}</td>
                    <td className="px-4 py-2.5 text-admin-ink-2">{pkg.duration ?? "—"}</td>
                    <td className="px-4 py-2.5 text-admin-ink-2">
                      {pkg.price != null ? `₹${pkg.price}` : "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      {pkg.slots_left != null ? (
                        <AdminBadge className={pkg.slots_left === 0 ? "bg-red-500/10 text-red-500 font-bold" : "bg-emerald-500/10 text-emerald-600 font-bold"}>
                          {pkg.slots_left === 0 ? "Sold Out" : `⚡ ${pkg.slots_left} slots`}
                        </AdminBadge>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <AdminBadge className={pkg.status === "draft" ? "bg-admin-accent-soft text-admin-accent" : undefined}>
                        {pkg.status === "draft" ? "Draft" : "Published"}
                      </AdminBadge>
                    </td>
                    <td className="px-4 py-2.5">
                      {pkg.is_top_pick ? <AdminBadge>Top pick</AdminBadge> : "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <AdminIconButton onClick={() => openEditForm(pkg)} aria-label="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </AdminIconButton>
                        <AdminIconButton
                          variant="danger"
                          onClick={() => handleDelete(pkg.id)}
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
