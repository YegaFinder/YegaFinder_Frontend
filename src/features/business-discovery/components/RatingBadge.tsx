interface RatingBadgeProps {
  rating: number;
  reviewCount: number;
  size?: "sm" | "md";
}

export function RatingBadge({ rating, reviewCount, size = "md" }: RatingBadgeProps) {
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  if (reviewCount === 0) {
    return (
      <span className={`${textSize} text-muted-foreground`}>
        No reviews yet
      </span>
    );
  }

  return (
    <span className={`${textSize} inline-flex items-center gap-1`}>
      <span aria-hidden="true">⭐</span>
      <span className="font-medium">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground">({reviewCount})</span>
    </span>
  );
}
