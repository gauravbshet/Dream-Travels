// These ids are the canonical `packages.category` values stored in the
// database — the admin dropdown, the API-less Supabase queries, and this
// slider all key off the same four slugs.
export type CategorySlug = "solo" | "group" | "family" | "international";

export type Category = {
  id: CategorySlug;
  label: string;
  iconUrl: string;
  iconAlt: string;
};

export const categories: Category[] = [
  {
    id: "solo",
    label: "Solo Trips",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/10368/10368796.png",
    iconAlt: "Solo travel icon",
  },
  {
    id: "group",
    label: "Group Trips",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/201/201426.png",
    iconAlt: "Hotel service icon",
  },
  {
    id: "family",
    label: "Family Trips",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/9638/9638464.png",
    iconAlt: "Tourism icon",
  },
  {
    id: "international",
    label: "International Trips",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/4540/4540365.png",
    iconAlt: "International travel icon",
  },
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
