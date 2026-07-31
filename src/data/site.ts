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
  { label: "Home", href: "/" },
  { label: "Destinations", href: "#destinations" },
  { label: "Packages", href: "#packages" },
  { label: "Experiences", href: "#experiences" },
  { label: "Community", href: "#community" },
  { label: "Blogs", href: "#blogs" },
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
    title: "Instant Booking",
    description: "Confirm your trip in seconds with real-time availability.",
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
    title: "Secure Payments",
    description: "Bank-grade encryption for every transaction.",
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

export const stats: Stat[] = [
  { id: "travellers", label: "Happy Travellers", value: 75000, suffix: "+" },
  { id: "destinations", label: "Destinations", value: 250, suffix: "+" },
  { id: "rating", label: "Google Rating", value: 4.9, suffix: "★" },
  { id: "satisfaction", label: "Customer Satisfaction", value: 99, suffix: "%" },
];
