"use client";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, readOnly = false }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1" role={readOnly ? undefined : "radiogroup"} aria-label="Rating">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={`text-xl ${readOnly ? "cursor-default" : "cursor-pointer"} ${
            star <= value ? "text-yellow-500" : "text-muted-foreground"
          }`}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
