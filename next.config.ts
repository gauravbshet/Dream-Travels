import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    // Cloudinary already optimizes every image we serve (resize/format/
    // quality via URL params). Next's own optimizer needs an explicit
    // Cloudflare Images binding to work on Workers (via @opennextjs/cloudflare)
    // which we don't have configured — leaving it enabled without that binding
    // risks images silently passing through unoptimized or erroring. Disabling
    // it here means next/image just renders the Cloudinary URL directly.
    unoptimized: true,
    // Every host serving an image referenced from the database has to be listed
    // here. `next/image` throws on an unlisted host, and because that throw
    // happens during render it takes the entire page down with a 500 — not just
    // the one image. Add the host here before its URLs go into the CMS.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        // Images stored in Supabase Storage.
        protocol: "https",
        hostname: "xyswpbhobzcmhswowyra.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
