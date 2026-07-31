import {
  MapPin,
  Waves,
  Mountain,
  Trees,
  Tent,
  Compass,
  Backpack,
  Car,
  Ship,
  Gem,
  Heart,
  PawPrint,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const categories: Category[] = [
  { id: "nearby", label: "Nearby", icon: MapPin },
  { id: "beaches", label: "Beaches", icon: Waves },
  { id: "mountains", label: "Mountains", icon: Mountain },
  { id: "forest", label: "Forest", icon: Trees },
  { id: "camping", label: "Camping", icon: Tent },
  { id: "adventure", label: "Adventure", icon: Compass },
  { id: "backpacking", label: "Backpacking", icon: Backpack },
  { id: "road-trips", label: "Road Trips", icon: Car },
  { id: "cruises", label: "Cruises", icon: Ship },
  { id: "luxury", label: "Luxury", icon: Gem },
  { id: "honeymoon", label: "Honeymoon", icon: Heart },
  { id: "wildlife", label: "Wildlife", icon: PawPrint },
];
