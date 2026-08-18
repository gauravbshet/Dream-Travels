export type Review = {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  review: string;
  date: string;
};

export const reviews: Review[] = [];

