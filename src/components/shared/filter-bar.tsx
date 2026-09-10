"use client";

import { cn } from "@/lib/utils";

export interface FilterBarValue {
  categoryId?: string;
  /** Radius in kilometers. undefined = no distance filter. */
  maxDistanceKm?: number;
  /** Minimum star rating, 1-5. undefined = no rating filter. */
  minRating?: number;
  openNow?: boolean;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface FilterBarProps {
  value: FilterBarValue;
  onChange: (next: FilterBarValue) => void;
  categories: CategoryOption[];
  categoriesLoading?: boolean;
  className?: string;
}

const DISTANCE_OPTIONS_KM = [1, 3, 5, 10, 20];
const RATING_OPTIONS = [4, 3, 2, 1];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors",
        active ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Filter chips shared between /search (results filtering) and /nearby
 * (map filtering) so the two screens can't drift into different filter
 * sets or behavior. Backend query-param mapping (category, distance,
 * rating, open now) lives in each page's own data-fetching hook — this
 * component only owns the UI + local value shape.
 */
export function FilterBar({ value, onChange, categories, categoriesLoading, className }: FilterBarProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Chip active={!value.categoryId} onClick={() => onChange({ ...value, categoryId: undefined })}>
          All categories
        </Chip>
        {categoriesLoading && <span className="px-2 text-sm text-muted-foreground">Loading…</span>}
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            active={value.categoryId === cat.id}
            onClick={() => onChange({ ...value, categoryId: cat.id })}
          >
            {cat.name}
          </Chip>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Chip active={!value.maxDistanceKm} onClick={() => onChange({ ...value, maxDistanceKm: undefined })}>
          Any distance
        </Chip>
        {DISTANCE_OPTIONS_KM.map((km) => (
          <Chip
            key={km}
            active={value.maxDistanceKm === km}
            onClick={() => onChange({ ...value, maxDistanceKm: km })}
          >
            Within {km} km
          </Chip>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <Chip active={!value.minRating} onClick={() => onChange({ ...value, minRating: undefined })}>
          Any rating
        </Chip>
        {RATING_OPTIONS.map((stars) => (
          <Chip
            key={stars}
            active={value.minRating === stars}
            onClick={() => onChange({ ...value, minRating: stars })}
          >
            {stars}+ ★
          </Chip>
        ))}
        <Chip active={!!value.openNow} onClick={() => onChange({ ...value, openNow: !value.openNow })}>
          Open now
        </Chip>
      </div>
    </div>
  );
}
