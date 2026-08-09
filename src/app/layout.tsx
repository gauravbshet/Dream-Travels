import type { Metadata, Viewport } from "next";
import { Archivo, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { RouteAwareNavbar, RouteAwareBottomNav } from "@/components/layout/RouteAwareNavigation";
import { FooterGuard } from "@/components/layout/FooterGuard";
import { AtmosphereField } from "@/components/ui/AtmosphereField";

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
    process.env.NEXT_PUBLIC_SITE_URL || "https://dreamtravels.com"
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
      className={`${archivo.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink">
        <AtmosphereField />
        <div className="relative flex min-h-full flex-1 flex-col" style={{ zIndex: 1 }}>
          <RouteAwareNavbar />
          {children}
          <FooterGuard />
          <RouteAwareBottomNav />
        </div>
      </body>
    </html>
  );
}
