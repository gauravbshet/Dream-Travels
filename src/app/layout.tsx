import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAFA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-ink">
        {children}
      </body>
    </html>
  );
}
