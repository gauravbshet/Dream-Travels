import type { NextConfig } from "next";

// Every third-party origin the browser actually talks to, gathered from the
// codebase: Supabase (DB + auth + storage), Cloudinary (image/video CDN +
// unsigned client uploads), Unsplash and Flaticon (seed/placeholder images),
// and the MDN sample video used as reel placeholder content. Keep this in
// sync if a new external host is ever added to next.config's image
// remotePatterns or fetched from client code.
const SUPABASE_ORIGIN = "https://xyswpbhobzcmhswowyra.supabase.co";

const contentSecurityPolicy = [
  "default-src 'self'",

  // Next.js ships inline bootstrap data and this app renders JSON-LD via
  // dangerouslySetInnerHTML <script> tags — both need 'unsafe-inline' since
  // there's no nonce/hash pipeline wired up yet. Cloudflare auto-injects its
  // Web Analytics beacon (static.cloudflareinsights.com) into every response
  // on the zone; without allowlisting it here the browser silently blocks
  // the script and Cloudflare collects zero real-user-monitoring data.
  `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,

  // Tailwind arbitrary values and inline style={} usage throughout the UI.
  // Google Fonts stylesheet is allowed here.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

  `img-src 'self' data: blob: https://images.unsplash.com https://cdn-icons-png.flaticon.com https://res.cloudinary.com ${SUPABASE_ORIGIN}`,

  // Google Fonts font files are served from fonts.gstatic.com.
  "font-src 'self' data: https://fonts.gstatic.com",

  `media-src 'self' https://res.cloudinary.com https://interactive-examples.mdn.mozilla.net ${SUPABASE_ORIGIN}`,
  `connect-src 'self' ${SUPABASE_ORIGIN} wss://${SUPABASE_ORIGIN.replace("https://", "")} https://api.cloudinary.com https://static.cloudflareinsights.com https://cloudflareinsights.com`,

  // The Cloudflare beacon script reports RUM data back via a beacon/fetch
  // call. Both hosts are allowed: it loads from static.cloudflareinsights.com
  // and, depending on the beacon version, posts to either that host or the
  // apex cloudflareinsights.com.
  `connect-src 'self' ${SUPABASE_ORIGIN} wss://${SUPABASE_ORIGIN.replace(
    "https://",
    ""
  )} https://api.cloudinary.com https://static.cloudflareinsights.com https://cloudflareinsights.com`,

  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // lucide-react and framer-motion are both used throughout the UI.
  // Explicit optimization helps avoid pulling unnecessary code from
  // their package barrel files.
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  turbopack: {
    root: __dirname,
  },

  images: {
    // Cloudinary already optimizes every image we serve.
    unoptimized: true,

    // Every host serving an image referenced from the database has to be
    // listed here.
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

import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default analyzer(nextConfig);