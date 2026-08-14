import {
  UserCheck,
  Users,
  ShieldCheck,
  Zap,
  BadgeCheck,
  Headphones,
  Lock,
  MapPinned,
  Package as PackageIcon,
  type LucideIcon,
} from "lucide-react";

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Destination", href: "/destinations" },
  { label: "Package", href: "#packages" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const features: Feature[] = [
  {
    id: "solo",
    title: "Solo Traveller Friendly",
    description: "Curated trips designed for safe, social solo adventures.",
    icon: UserCheck,
  },
  {
    id: "group",
    title: "Group Trips",
    description: "Perfectly planned itineraries for groups of any size.",
    icon: Users,
  },
  {
    id: "women",
    title: "Women-Friendly Tours",
    description: "Dedicated support and safety for women travellers.",
    icon: ShieldCheck,
  },
  {
    id: "instant",
    title: "Fast Replies",
    description: "Send an enquiry on WhatsApp and hear back from a real planner.",
    icon: Zap,
  },
  {
    id: "verified",
    title: "Verified Tour Leaders",
    description: "Experienced, background-checked local experts.",
    icon: BadgeCheck,
  },
  {
    id: "support",
    title: "24×7 Support",
    description: "Round-the-clock assistance before, during, and after trips.",
    icon: Headphones,
  },
  {
    id: "secure",
    title: "Transparent Pricing",
    description: "Clear per-person costs shared upfront — ask what's included.",
    icon: Lock,
  },
  {
    id: "custom",
    title: "Custom Itineraries",
    description: "Tailor-made journeys built around your preferences.",
    icon: MapPinned,
  },
  {
    id: "inclusive",
    title: "All-Inclusive Packages",
    description: "Stays, meals, and transfers bundled — no hidden costs.",
    icon: PackageIcon,
  },
];

export type Stat = {
  id: string;
  label: string;
  value: number;
  suffix: string;
};

/**
 * Headline statistics shown in the Statistics section.
 *
 * INTENTIONALLY EMPTY. This previously carried invented figures
 * (75,000+ travellers, 250 destinations, 4.9 Google rating, 99%
 * satisfaction) that nothing in the business could substantiate — the
 * database holds roughly a dozen destinations, not 250.
 *
 * `Statistics` renders nothing while this is empty, which is the correct
 * behaviour: no number beats a made-up one. Add entries back only for
 * figures you can point at a source for (a Google Business rating, a real
 * booking count). Everything here is shown to customers as fact.
 */
export const stats: Stat[] = [];

/**
 * Social proof for the Hero badge.
 *
 * The star rating / review count that used to live here also fed the
 * homepage JSON-LD `aggregateRating`. Publishing a rating that isn't backed
 * by real collected reviews breaks Google's structured-data policy and can
 * cost the site its rich results, so both the rating and the JSON-LD block
 * that consumed it are gone until there are real reviews to aggregate.
 *
 * `tagline` is a plain positioning statement — true by construction, and it
 * needs no numbers to stand up.
 */
export const heroBadge = {
  tagline: "Mountain & forest trips, planned by real people",
} as const;

