import { unsplash, IMG } from "./images";

export type Blog = {
  id: string;
  title: string;
  category: string;
  image: string;
  readTime: string;
  author: string;
  date: string;
  excerpt: string;
};

export const blogs: Blog[] = [
  {
    id: "hidden-gems-northeast",
    title: "10 Hidden Gems in Northeast India You Must Visit",
    category: "Offbeat",
    image: unsplash(IMG.blog1),
    readTime: "6 min read",
    author: "Meera Iyer",
    date: "Jul 12, 2026",
    excerpt:
      "From misty valleys to living root bridges, discover the offbeat trails of the Northeast.",
  },
  {
    id: "pack-for-himalayas",
    title: "The Ultimate Packing Guide for Himalayan Treks",
    category: "Travel Tips",
    image: unsplash(IMG.blog2),
    readTime: "8 min read",
    author: "Arjun Rao",
    date: "Jun 28, 2026",
    excerpt:
      "Everything you need to pack smart and stay comfortable on high-altitude adventures.",
  },
  {
    id: "budget-goa",
    title: "How to Explore Goa on a Budget Without Missing Out",
    category: "Budget Travel",
    image: unsplash(IMG.blog3),
    readTime: "5 min read",
    author: "Sanya Kapoor",
    date: "Jul 02, 2026",
    excerpt:
      "Sun, sand and savings — our guide to enjoying Goa without breaking the bank.",
  },
];
