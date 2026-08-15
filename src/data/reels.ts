import { unsplash, IMG } from "./images";
import type { CategorySlug } from "./categories";
import { packages as allStaticPackages, topPicks as staticTopPicks } from "./packages";

export type LinkedPackage = {
  id: string;
  slug?: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  duration: string;
  location?: string;
  rating?: number;
};

export type Reel = {
  id: string;
  title: string;
  destination: string | null;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  instagramUrl: string | null;
  category: CategorySlug | string | null;
  price?: number;
  rating?: number;
  duration?: string;
  packageSlug?: string;
  packageId?: string | null;
  linkedPackage?: LinkedPackage | null;
  isActive?: boolean;
  displayOrder?: number;
  isFeaturedWidget?: boolean;
  is_featured_widget?: boolean;
};

// Looks up the package a static-fallback reel is tagged with, so the "Book
// Now" footer under each reel card has something to show even before
// Supabase's `reels.package_id` join kicks in.
function findStaticPackage(slug?: string): LinkedPackage | null {
  if (!slug) return null;
  const pkg = [...allStaticPackages, ...staticTopPicks].find((p) => p.slug === slug);
  if (!pkg) return null;
  return {
    id: pkg.id,
    slug: pkg.slug,
    title: pkg.title,
    price: pkg.price,
    originalPrice: pkg.originalPrice,
    image: pkg.image,
    duration: pkg.duration,
    location: pkg.location,
    rating: pkg.rating,
  };
}

// Shown only when Supabase has no active reels yet (e.g. fresh dev setup),
// same fallback pattern as src/data/packages.ts / src/data/destinations.ts.
export const reels: Reel[] = [
  {
    id: "reel-pawna-maharashtra",
    title: "Pawna Lake Lakeside Camping",
    destination: "Lonavala, Maharashtra",
    description: "Lakeside camping under stars with bonfire, BBQ & live music.",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
    instagramUrl: "https://instagram.com/dreamtravels",
    category: "group",
    price: 2499,
    rating: 4.8,
    duration: "2D / 1N",
    packageSlug: "pawna-lake-camping",
    linkedPackage: findStaticPackage("pawna-lake-camping"),
    isFeaturedWidget: true,
  },
  {
    id: "reel-goa-weekend",
    title: "Goa Beach Fiesta & Water Sports",
    destination: "North Goa",
    description: "Sun, sand, water sports crew and beach shack sunset parties.",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnailUrl: unsplash(IMG.goa),
    instagramUrl: "https://instagram.com/dreamtravels",
    category: "group",
    price: 14999,
    rating: 4.8,
    duration: "4D / 3N",
    packageSlug: "goa-beach-fiesta",
    linkedPackage: findStaticPackage("goa-beach-fiesta"),
  },
  {
    id: "reel-kashmir-solo",
    title: "Kashmir Houseboat & Paradise",
    destination: "Srinagar, Kashmir",
    description: "Shikara mornings on Dal Lake, snow peaks and pine forests.",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnailUrl: unsplash(IMG.kashmir),
    instagramUrl: "https://instagram.com/dreamtravels",
    category: "family",
    price: 28999,
    rating: 4.9,
    duration: "6D / 5N",
    packageSlug: "kashmir-family-escape",
    linkedPackage: findStaticPackage("kashmir-family-escape"),
  },
  {
    id: "reel-spiti-explorer",
    title: "Spiti Valley Solo Explorer",
    destination: "Spiti, Himachal Pradesh",
    description: "Rugged Himalayan mountain trail, stargazing & ancient monasteries.",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnailUrl: unsplash(IMG.spiti),
    instagramUrl: "https://instagram.com/dreamtravels",
    category: "solo",
    price: 22999,
    rating: 4.9,
    duration: "7D / 6N",
    packageSlug: "spiti-solo-explorer",
    linkedPackage: findStaticPackage("spiti-solo-explorer"),
  },
];
