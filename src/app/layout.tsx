import type { Metadata, Viewport } from "next";

import { Archivo, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { RouteAwareNavbar, RouteAwareBottomNav } from "@/components/layout/RouteAwareNavigation";
import { FooterGuard } from "@/components/layout/FooterGuard";
import { WishlistProvider } from "@/components/providers/WishlistProvider";

// Both are purely decorative/floating overlays with zero SEO or above-the-fold
// content value (AtmosphereField is `aria-hidden`; the reel widget is a
// floating video pill that fetches its own data client-side). They were
// previously bundled into every route's initial JS via a static import in
// the root layout — meaning their combined weight (framer-motion animations,
// a Supabase client, an mp4 video player, a booking modal) blocked the main
// thread on pages that never even show them (e.g. /login, /admin,
// /cancellation-policy). `ssr: false` code-splits them into a chunk that
// loads after hydration instead of shipping with the critical bundle.
import { AtmosphereField, DreamTravelsReelWidget } from "@/components/layout/ClientDynamicWrappers";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://dream-travels.in"
),
  title: "Dream Travels | Discover Your Next Adventure",
  description:
    "Dream Travels is a premium travel booking platform for curated trips, dream destinations, and unforgettable experiences across the globe.",
  keywords: [
    "travel",
    "vacation packages",
    "tour booking",
    "adventure travel",
    "Dream Travels",
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "Dream Travels",
    title: "Dream Travels | Discover Your Next Adventure",
    description:
      "Dream Travels is a premium travel booking platform for curated trips, dream destinations, and unforgettable experiences across the globe.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dream Travels — Discover Your Next Adventure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dream Travels | Discover Your Next Adventure",
    description:
      "Dream Travels is a premium travel booking platform for curated trips, dream destinations, and unforgettable experiences across the globe.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1a14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${bricolage.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-ink" suppressHydrationWarning>
        <AtmosphereField />
        <div className="relative flex min-h-full flex-1 flex-col" style={{ zIndex: 1 }}>
          <RouteAwareNavbar />
          <WishlistProvider>{children}</WishlistProvider>
          <FooterGuard />
          <RouteAwareBottomNav />
        </div>
        <DreamTravelsReelWidget />
      </body>
    </html>
  );
}
