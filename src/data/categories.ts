import {
  Backpack,
  UsersRound,
  Users,
  Globe,
  type LucideIcon,
} from "lucide-react";

// These ids are the canonical `packages.category` values stored in the
// database — the admin dropdown, the API-less Supabase queries, and this
// slider all key off the same four slugs.
export type CategorySlug = "solo" | "group" | "family" | "international";

export type Category = {
  id: CategorySlug;
  label: string;
  icon: LucideIcon;
};

// Each category needs a silhouette that reads differently at 24px — the
// previous set was three near-identical person glyphs, and `Group` rendered
// as an abstract dashed box that didn't read as people at all.
export const categories: Category[] = [
  { id: "solo", label: "Solo Trips", icon: Backpack },
  { id: "group", label: "Group Trips", icon: UsersRound },
  { id: "family", label: "Family Trips", icon: Users },
  { id: "international", label: "International Trips", icon: Globe },
];

export const categoryLabels: Record<CategorySlug, string> = {
  solo: "Solo Trips",
  group: "Group Trips",
  family: "Family Trips",
  international: "International Trips",
};

export function isCategorySlug(value: string): value is CategorySlug {
  return value in categoryLabels;
}
