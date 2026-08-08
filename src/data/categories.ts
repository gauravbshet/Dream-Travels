import {
  UserRound,
  Users,
  Group,
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

export const categories: Category[] = [
  { id: "solo", label: "Solo Trips", icon: UserRound },
  { id: "group", label: "Group Trips", icon: Group },
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
