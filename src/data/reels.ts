import { unsplash, IMG } from "./images";
import type { CategorySlug } from "./categories";

export type Reel = {
  id: string;
  title: string;
  destination: string | null;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  instagramUrl: string | null;
  category: CategorySlug | string | null;
  isActive?: boolean;
  displayOrder?: number;
};

// Shown only when Supabase has no active reels yet (e.g. fresh dev setup),
// same fallback pattern as src/data/packages.ts / src/data/destinations.ts.
export const reels: Reel[] = [
  {
    id: "reel-goa-weekend",
    title: "Weekend Escape to Goa",
    destination: "Goa",
    description: "Sun, sand, and a beach shack breakfast to start the day right.",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnailUrl: unsplash(IMG.goa),
    instagramUrl: "https://instagram.com/dreamtravels",
    category: "group",
  },
  {
    id: "reel-kashmir-solo",
    title: "Solo in Kashmir",
    destination: "Srinagar, Kashmir",
    description: "Shikara mornings on Dal Lake, just you and the mountains.",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnailUrl: unsplash(IMG.kashmir),
    instagramUrl: "https://instagram.com/dreamtravels",
    category: "solo",
  },
  {
    id: "reel-kerala-family",
    title: "Backwaters with the Family",
    destination: "Alleppey, Kerala",
    description: "A houseboat, home-cooked meals, and three generations onboard.",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnailUrl: unsplash(IMG.kerala),
    instagramUrl: "https://instagram.com/dreamtravels",
    category: "family",
  },
  {
    id: "reel-bali-international",
    title: "Island Hopping in Bali",
    destination: "Bali, Indonesia",
    description: "Temples at dawn, rice terraces by noon, beach clubs by sunset.",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnailUrl: unsplash(IMG.bali),
    instagramUrl: "https://instagram.com/dreamtravels",
    category: "international",
  },
];
