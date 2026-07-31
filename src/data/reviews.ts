import { unsplash, IMG } from "./images";

export type Review = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  review: string;
  date: string;
};

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Ananya Sharma",
    avatar: unsplash(IMG.avatar1, 200),
    rating: 5,
    review:
      "Dream Travels made our Kashmir trip absolutely seamless. Every detail was taken care of, from pickup to the last day. Highly recommend!",
    date: "2 weeks ago",
  },
  {
    id: "r2",
    name: "Rohan Mehta",
    avatar: unsplash(IMG.avatar2, 200),
    rating: 5,
    review:
      "The Leh expedition exceeded expectations. Our tour leader was fantastic and the itinerary balanced adventure with comfort perfectly.",
    date: "1 month ago",
  },
  {
    id: "r3",
    name: "Priya Nair",
    avatar: unsplash(IMG.avatar3, 200),
    rating: 4,
    review:
      "Loved the Kerala backwaters package. Beautiful houseboats and great food. Would book again for our next family trip.",
    date: "3 weeks ago",
  },
  {
    id: "r4",
    name: "Karan Malhotra",
    avatar: unsplash(IMG.avatar4, 200),
    rating: 5,
    review:
      "Booking was instant and support was available 24x7 throughout our Spiti journey. Truly a premium travel experience.",
    date: "5 days ago",
  },
];
