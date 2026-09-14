"use client";

export type SortOption = "relevance" | "rating" | "distance" | "name";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  /** Include "distance" only where distanceKm is actually populated (e.g. Nearby). */
  includeDistance?: boolean;
  className?: string;
}

/**
 * Client-side sort only. Neither /businesses nor /businesses/nearby expose a
 * `sort` query param in FRONTEND_API_IMPLEMENTATION_GUIDE.md, so this never
 * sends one — it re-orders the page of results already fetched. Apply the
 * returned value with `sortBusinesses()` below.
 */
export function SortDropdown({ value, onChange, includeDistance = false, className }: SortDropdownProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className={className ?? "rounded-md border px-3 py-2 text-sm"}
    >
      <option value="relevance">Sort: Relevance</option>
      <option value="rating">Sort: Highest rated</option>
      {includeDistance && <option value="distance">Sort: Nearest</option>}
      <option value="name">Sort: Name (A–Z)</option>
    </select>
  );
}

interface SortableItem {
  averageRating: number;
  businessName: string;
  distanceKm?: number;
}

/** Pure client-side sort helper — pass the array, get a new sorted array back. */
export function sortBusinesses<T extends SortableItem>(items: T[], sort: SortOption): T[] {
  const copy = [...items];
  switch (sort) {
    case "rating":
      return copy.sort((a, b) => b.averageRating - a.averageRating);
    case "distance":
      return copy.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
    case "name":
      return copy.sort((a, b) => a.businessName.localeCompare(b.businessName));
    case "relevance":
    default:
      return copy;
  }
}