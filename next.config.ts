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
  // there's no nonce/hash pipeline wired up yet.
  "script-src 'self' 'unsafe-inline'",
  // Tailwind arbitrary values and inline style={} usage throughout the UI.
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://images.unsplash.com https://cdn-icons-png.flaticon.com https://res.cloudinary.com ${SUPABASE_ORIGIN}`,
  "font-src 'self' data:",
  "media-src 'self' https://res.cloudinary.com https://interactive-examples.mdn.mozilla.net",
  `connect-src 'self' ${SUPABASE_ORIGIN} wss://${SUPABASE_ORIGIN.replace("https://", "")} https://api.cloudinary.com`,
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
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
