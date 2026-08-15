/**
 * Injects Cloudinary delivery transformations (auto format, auto quality,
 * width cap) into a Cloudinary URL.
 *
 * Next's built-in image optimizer is disabled in next.config.ts because
 * Cloudinary already handles resizing/compression via URL params — but only
 * if those params are actually present. Raw upload URLs (what
 * uploadToCloudinary returns and what's stored in the DB) serve the original
 * file untouched, which is how a 200px card thumbnail was shipping a
 * multi-MB original image straight to the browser. This wraps every dynamic
 * <Image src> at the point of use so the CDN resizes/compresses/re-encodes
 * before the bytes ever leave Cloudinary.
 *
 * Non-Cloudinary URLs (Unsplash, Supabase Storage, flaticon, etc.) pass
 * through unchanged.
 */
export function cldUrl(url: string | null | undefined, width: number): string {
  if (!url) return url ?? "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}
