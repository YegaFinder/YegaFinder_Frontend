"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";
import type { NewReview } from "../types/review.types";

interface ReviewFormProps {
  onSubmit: (review: NewReview) => void;
  isSubmitting?: boolean;
}

export function ReviewForm({ onSubmit, isSubmitting = false }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-sm font-medium block mb-1">Your rating</label>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Your review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Share your experience..."
        />
      </div>
      <button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
