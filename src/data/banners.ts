import { unsplash, IMG } from "./images";

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

export const banners: Banner[] = [
  {
    id: "discover-paradise",
    title: "Discover Paradise",
    subtitle: "Island escapes starting at ₹24,999",
    image: unsplash(IMG.hero1, 1600),
  },
  {
    id: "weekend-escapes",
    title: "Weekend Escapes",
    subtitle: "Quick getaways just a few hours away",
    image: unsplash(IMG.hero2, 1600),
  },
  {
    id: "summer-adventure-sale",
    title: "Summer Adventure Sale",
    subtitle: "Up to 30% off on mountain expeditions",
    image: unsplash(IMG.hero3, 1600),
  },
];
