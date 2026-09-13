import { StarRating } from "./StarRating";
import type { Review } from "../types/review.types";

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-muted-foreground text-sm">No reviews yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="border-b pb-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{review.authorName}</span>
            <StarRating value={review.rating} readOnly />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}
