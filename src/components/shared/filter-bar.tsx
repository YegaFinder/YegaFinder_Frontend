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
  /** Hide the distance chips — for contexts with no user coordinates (e.g. /search). */
  hideDistance?: boolean;
  /** Hide "Open now" — for contexts where businessHours isn't reliably typed/available. */
  hideOpenNow?: boolean;
}

const DISTANCE_OPTIONS_KM = [1, 3, 5, 10, 20];
const RATING_OPTIONS = [4, 3, 2, 1];

function Chip({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors",
        disabled
          ? "cursor-not-allowed bg-muted text-muted-foreground opacity-60"
          : active
            ? "bg-primary text-primary-foreground"
            : "bg-background hover:bg-muted",
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
 *
 * FIXED: category chips are now disabled (not removed — the chips are
 * still useful as a preview of what's coming) rather than fully
 * interactive. Per YegnaFinder_Backend_Reference.md B1: businessCategories
 * is accepted and validated on merchant profile save but never actually
 * persisted server-side, so `businessCategories` is always `[]` on every
 * real listing today. That means every category chip, for every user, on
 * both /search and /nearby, would always filter down to zero results —
 * a UI element that appears to work but silently returns nothing every
 * single time is worse than no filter at all. Re-enable this the moment
 * the backend fixes B1 (delete the `disabled` prop below and its note).
 */
export function FilterBar({
  value,
  onChange,
  categories,
  categoriesLoading,
  className,
  hideDistance,
  hideOpenNow,
}: FilterBarProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip active={!value.categoryId} onClick={() => onChange({ ...value, categoryId: undefined })} disabled>
            All categories
          </Chip>
          {categoriesLoading && <span className="px-2 text-sm text-muted-foreground">Loading…</span>}
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              active={value.categoryId === cat.id}
              onClick={() => onChange({ ...value, categoryId: cat.id })}
              disabled
            >
              {cat.name}
            </Chip>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Filtering by category is coming soon.</p>
      </div>

      {!hideDistance && (
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
      )}

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
        {!hideOpenNow && (
          <Chip active={!!value.openNow} onClick={() => onChange({ ...value, openNow: !value.openNow })}>
            Open now
          </Chip>
        )}
      </div>
    </div>
  );
}
