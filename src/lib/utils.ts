import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Formats a `YYYY-MM-DD` date string (from `<input type="date">` or a
 * Postgres `date` column) as a friendly label, e.g. "Fri, 20 Sep 2026". */
export function formatDateLabel(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Normalizes a user-entered URL (trims, adds a scheme if missing) and
 * returns null if the result still isn't a valid absolute URL. */
export function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withScheme).toString();
  } catch {
    return null;
  }
}

export function createStoragePath(folder: string, file: File) {
  const rawFileName = file.name.replace(/\\/g, "/").split("/").pop() ?? file.name;
  const extension = rawFileName.split(".").pop()?.toLowerCase() ?? "";
  const baseName = rawFileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "") || "file";
  const safeExt = extension ? `.${extension}` : "";
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  return `${folder}/${baseName}_${Date.now()}_${randomSuffix}${safeExt}`;
}
