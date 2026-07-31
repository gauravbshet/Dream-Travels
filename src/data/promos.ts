import { unsplash, IMG } from "./images";

export type Promo = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const promos: Promo[] = [
  {
    id: "corporate-outings",
    title: "Corporate Team Outings",
    description: "Strengthen teams with curated offsite experiences.",
    image: unsplash(IMG.luxury, 1200),
  },
  {
    id: "luxury-camping",
    title: "Luxury Camping",
    description: "Glamping under the stars, without giving up comfort.",
    image: unsplash(IMG.camping, 1200),
  },
  {
    id: "family-holidays",
    title: "Family Holidays",
    description: "Stress-free itineraries built for every generation.",
    image: unsplash(IMG.honeymoon, 1200),
  },
  {
    id: "adventure-weekends",
    title: "Adventure Weekends",
    description: "Pack a lifetime of thrill into just two days.",
    image: unsplash(IMG.adventure, 1200),
  },
];
