import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";
import AuthNavbar from "@/components/layout/AuthNavbar";
import { FooterGuard } from "@/components/layout/FooterGuard";
import { BottomNav } from "@/components/layout/BottomNav";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"], // optical sizing — sharper, higher-contrast large headlines
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
  themeColor: "#FAF7F2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink">
        <AuthNavbar />
        {children}
        <FooterGuard />
        <BottomNav />
      </body>
    </html>
  );
}
