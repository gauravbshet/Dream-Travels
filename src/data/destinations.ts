import { unsplash, IMG } from "./images";

export type Destination = {
  id: string;
  slug?: string;
  name: string;
  image: string;
  cover_image?: string;
  price: number;
  rating: number;
  description?: string;
};

export const recommendedDestinations: Destination[] = [
  { id: "munnar", name: "Munnar", image: unsplash(IMG.munnar), price: 12999, rating: 4.7 },
  { id: "goa", name: "Goa", image: unsplash(IMG.goa), price: 9999, rating: 4.6 },
  { id: "coorg", name: "Coorg", image: unsplash(IMG.coorg), price: 13999, rating: 4.7 },
  { id: "wayanad", name: "Wayanad", image: unsplash(IMG.wayanad), price: 11999, rating: 4.6 },
  { id: "ooty", name: "Ooty", image: unsplash(IMG.ooty), price: 10999, rating: 4.5 },
  { id: "manali", name: "Manali", image: unsplash(IMG.manali), price: 15999, rating: 4.8 },
  { id: "andaman", name: "Andaman", image: unsplash(IMG.andaman), price: 28999, rating: 4.9 },
  { id: "lakshadweep", name: "Lakshadweep", image: unsplash(IMG.lakshadweep), price: 34999, rating: 4.8 },
];

export type MasonryDestination = Destination & { span: "tall" | "short" };

export const interestingDestinations: MasonryDestination[] = [
  { id: "yelagiri", name: "Yelagiri", image: unsplash(IMG.yelagiri), price: 6999, rating: 4.4, span: "short" },
  { id: "coorg-2", name: "Coorg", image: unsplash(IMG.coorg, 900), price: 13999, rating: 4.7, span: "tall" },
  { id: "munnar-2", name: "Munnar", image: unsplash(IMG.munnar, 900), price: 12999, rating: 4.7, span: "short" },
  { id: "valparai", name: "Valparai", image: unsplash(IMG.valparai), price: 8999, rating: 4.5, span: "tall" },
  { id: "goa-2", name: "Goa", image: unsplash(IMG.goa, 900), price: 9999, rating: 4.6, span: "short" },
  { id: "kodaikanal", name: "Kodaikanal", image: unsplash(IMG.kodaikanal), price: 9499, rating: 4.6, span: "tall" },
  { id: "kasol", name: "Kasol", image: unsplash(IMG.kasol), price: 10999, rating: 4.7, span: "short" },
  { id: "sikkim", name: "Sikkim", image: unsplash(IMG.sikkim), price: 19999, rating: 4.8, span: "tall" },
];

export type BudgetTier = {
  id: string;
  title: string;
  limit: string;
  count: number;
  emoji: string;
};

export const budgetTiers: BudgetTier[] = [
  { id: "under-5k", title: "Under ₹5,000", limit: "5000", count: 2, emoji: "🏕" },
  { id: "under-10k", title: "Under ₹10,000", limit: "10000", count: 6, emoji: "🚐" },
  { id: "under-20k", title: "Under ₹20,000", limit: "20000", count: 14, emoji: "🏞" },
  { id: "under-50k", title: "Premium Under ₹50,000", limit: "50000", count: 24, emoji: "✨" },
];

export type PopularExperience = {
  id: string;
  title: string;
  image: string;
};

export const popularExperiences: PopularExperience[] = [
  { id: "camping", title: "Camping", image: unsplash(IMG.camping, 900) },
  { id: "trekking", title: "Trekking", image: unsplash(IMG.mountain, 900) },
  { id: "scuba", title: "Scuba Diving", image: unsplash(IMG.beach, 900) },
  { id: "safari", title: "Wildlife Safari", image: unsplash(IMG.wildlife, 900) },
  { id: "houseboats", title: "Houseboats", image: unsplash(IMG.kerala, 900) },
  { id: "cruises", title: "Cruises", image: unsplash(IMG.cruise, 900) },
  { id: "paragliding", title: "Paragliding", image: unsplash(IMG.adventure, 900) },
  { id: "desert-camping", title: "Desert Camping", image: unsplash(IMG.roadtrip, 900) },
];

export type SeasonalCollection = {
  id: string;
  title: string;
  image: string;
};

export const seasonalCollections: SeasonalCollection[] = [
  { id: "summer", title: "Summer Escapes", image: unsplash(IMG.beach, 900) },
  { id: "monsoon", title: "Monsoon Trails", image: unsplash(IMG.forest, 900) },
  { id: "winter", title: "Winter Adventures", image: unsplash(IMG.spiti, 900) },
  { id: "honeymoon", title: "Honeymoon Specials", image: unsplash(IMG.honeymoon, 900) },
  { id: "family", title: "Family Holidays", image: unsplash(IMG.luxury, 900) },
  { id: "festival", title: "Festival Tours", image: unsplash(IMG.roadtrip, 900) },
];
