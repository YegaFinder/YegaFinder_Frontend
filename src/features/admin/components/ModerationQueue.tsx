"use client";

import { useModerationQueue } from "../hooks/useModerationQueue";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function ModerationQueue() {
  const { reviews, page, totalPages, setPage, isLoading, isError, deleteReview, isDeleting, deletingId } =
    useModerationQueue();

  return (
    <div className="space-y-4">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading reviews...</p>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">Could not load reviews.</p>
      ) : !reviews?.length ? (
        <p className="text-sm text-muted-foreground">No reviews to moderate.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-xl border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${i < review.rating ? "fill-yegna-primary text-yegna-primary" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    {review.comment && <p className="text-sm">{review.comment}</p>}
                    <p className="text-xs text-muted-foreground">
                      {review.user ? `${review.user.firstName} ${review.user.lastName}` : "Unknown user"} ·{" "}
                      {new Date(review.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteReview(review.id)}
                    disabled={isDeleting && deletingId === review.id}
                  >
                    {isDeleting && deletingId === review.id ? "Removing..." : "Remove"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}