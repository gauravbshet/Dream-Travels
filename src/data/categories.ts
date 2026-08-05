import {
  UserRound,
  Users,
  Group,
  Globe,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const categories: Category[] = [
  { id: "solo-travel", label: "Solo Travel", icon: UserRound },
  { id: "family-trips", label: "Family Trips", icon: Users },
  { id: "group-tours", label: "Group Tours", icon: Group },
  { id: "international-trips", label: "International Trips", icon: Globe },
];
