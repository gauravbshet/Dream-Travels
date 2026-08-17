/**
 * Package type definition.
 * All packages displayed across the site are fetched directly from Supabase
 * (uploaded via the Admin panel). Static dummy packages have been removed.
 */

export type Package = {
  id: string;
  slug?: string;
  title: string;
  location: string;
  image: string;
  category: string;
  duration: string;
  pickup: string;
  dates: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  original_price?: number;
  destination_id?: string;
  slots_left?: number | null;
  slotsLeft?: number | null;
};

export const packages: Package[] = [];
export const topPicks: Package[] = [];


