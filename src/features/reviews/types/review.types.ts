// Local to the reviews feature until backend confirms a real shape —
// deliberately NOT touching business.types.ts (shared with merchant side).
export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface NewReview {
  rating: number;
  comment: string;
}
