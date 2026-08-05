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

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
