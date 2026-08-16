/**
 * Client-side unsigned upload to Cloudinary. Replaces the old
 * supabase.storage.from("images").upload(...) + getPublicUrl(...) pattern
 * used across the admin dashboard.
 *
 * Requires an unsigned upload preset (create with
 * scripts/create-cloudinary-preset.js) and these env vars:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 *
 * Pre-upload behaviour (images only):
 *   - Files larger than MAX_IMAGE_SIZE_BYTES are rejected before any network
 *     request is made.
 *   - Images are re-encoded as WebP (quality 0.85) via an offscreen <canvas>
 *     to reduce upload size and ensure a consistent format in Cloudinary.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/** Maximum allowed image file size (4 MB). */
const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

/**
 * Converts an image File to a WebP Blob using an offscreen canvas.
 * Falls back to the original file if the browser does not support WebP output.
 */
async function convertToWebP(file: File, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        // Canvas 2D not available — use original file.
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            // Conversion failed — fall back to original.
            resolve(file);
            return;
          }

          // Preserve the original filename but with a .webp extension.
          const baseName = file.name.replace(/\.[^.]+$/, "");
          resolve(new File([blob], `${baseName}.webp`, { type: "image/webp" }));
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for WebP conversion."));
    };

    img.src = objectUrl;
  });
}

export async function uploadToCloudinary(
  file: File,
  folder: string,
  resourceType: "image" | "video" = "image"
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET env vars."
    );
  }

  // ── Image-specific pre-processing ────────────────────────────────────────
  let uploadFile = file;

  if (resourceType === "image") {
    // 1. Enforce 4 MB limit on the original file before any conversion.
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error(
        `Image is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). ` +
          `Maximum allowed size is ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024} MB.`
      );
    }

    // 2. Convert to WebP to reduce upload size and normalise the format.
    uploadFile = await convertToWebP(file);
  }
  // ─────────────────────────────────────────────────────────────────────────

  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", `dream-travels/${folder}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const errBody = await response.json().catch(() => null);
    throw new Error(
      errBody?.error?.message ?? `Cloudinary upload failed (${response.status})`
    );
  }

  return response.json();
}
