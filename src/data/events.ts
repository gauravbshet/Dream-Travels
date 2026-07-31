import { unsplash, IMG } from "./images";

export type TravelEvent = {
  id: string;
  title: string;
  image: string;
  date: string;
  location: string;
};

export const events: TravelEvent[] = [
  {
    id: "music-under-stars",
    title: "Music Under The Stars",
    image: unsplash(IMG.event1, 900),
    date: "Aug 16, 2026",
    location: "Rishikesh, Uttarakhand",
  },
  {
    id: "himalayan-camping-festival",
    title: "Himalayan Camping Festival",
    image: unsplash(IMG.event2, 900),
    date: "Sep 05, 2026",
    location: "Manali, Himachal Pradesh",
  },
  {
    id: "adventure-carnival",
    title: "Adventure Carnival",
    image: unsplash(IMG.event3, 900),
    date: "Sep 20, 2026",
    location: "Coorg, Karnataka",
  },
  {
    id: "photography-expedition",
    title: "Photography Expedition",
    image: unsplash(IMG.spiti, 900),
    date: "Oct 11, 2026",
    location: "Spiti Valley",
  },
  {
    id: "beach-camping-weekend",
    title: "Beach Camping Weekend",
    image: unsplash(IMG.beach, 900),
    date: "Oct 24, 2026",
    location: "Gokarna, Karnataka",
  },
];
