"use client";

import { cn } from "@/lib/utils";
import type { BusinessCategory } from "@/types/business.types";

interface FilterBarProps {
  /** Omit to hide the category select entirely (e.g. on a page with no categories). */
  categories?: BusinessCategory[];
  categoryId?: string;
  onCategoryChange?: (id: string | undefined) => void;

  /** Omit to hide the radius select entirely. */
  radiusOptions?: readonly number[];
  radius?: number | null;
  onRadiusChange?: (radius: number | null) => void;
  /** When true, there's no "Any distance" option — a radius is always required (e.g. the Nearby page). */
  radiusRequired?: boolean;
  radiusDisabled?: boolean;
  radiusDisabledReason?: string;

  className?: string;
}

/**
 * Shared filter row used by both SearchFeed and NearbyMap. Purely a
 * controlled-input renderer — all state and fetching stays in the parent
 * (matches the existing app convention of manual useState + hooks per page,
 * not a shared filter store).
 */
export function FilterBar({
  categories,
  categoryId,
  onCategoryChange,
  radiusOptions,
  radius,
  onRadiusChange,
  radiusRequired = false,
  radiusDisabled = false,
  radiusDisabledReason,
  className,
}: FilterBarProps) {
  const showCategory = !!categories && !!onCategoryChange;
  const showRadius = !!radiusOptions && !!onRadiusChange;

  if (!showCategory && !showRadius) return null;

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {showCategory && (
        <select
          value={categoryId ?? ""}
          onChange={(e) => onCategoryChange?.(e.target.value || undefined)}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories!.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      )}

      {showRadius && (
        <select
          value={radius ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            onRadiusChange?.(value === "" ? null : Number(value));
          }}
          disabled={radiusDisabled}
          title={radiusDisabled ? radiusDisabledReason : undefined}
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
        >
          {!radiusRequired && <option value="">Any distance</option>}
          {radiusOptions!.map((r) => (
            <option key={r} value={r}>
              Within {r} km
            </option>
          ))}
        </select>
      )}
    </div>
  );
}