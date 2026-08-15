import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
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
        // Destination and package photography uploaded via Cloudinary.
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
