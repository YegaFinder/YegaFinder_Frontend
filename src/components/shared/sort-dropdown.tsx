"use client";

import { cn } from "@/lib/utils";

export type SortOption = "distance" | "rating" | "name";

interface SortDropdownProps {
  value: SortOption;
  onChange: (next: SortOption) => void;
  /** Hide "distance" when the caller has no coordinates to sort by yet
   * (e.g. /search before the user shares location). Defaults to available. */
  distanceAvailable?: boolean;
  className?: string;
}

const LABELS: Record<SortOption, string> = {
  distance: "Nearest",
  rating: "Top rated",
  name: "Name (A–Z)",
};

/**
 * Shared sort control for /search and /nearby. A plain native <select> —
 * no headless-UI dependency needed for a single-choice dropdown, and it
 * gets free keyboard/screen-reader behavior.
 */
export function SortDropdown({ value, onChange, distanceAvailable = true, className }: SortDropdownProps) {
  const options: SortOption[] = distanceAvailable ? ["distance", "rating", "name"] : ["rating", "name"];

  return (
    <label className={cn("flex items-center gap-2 text-sm", className)}>
      <span className="text-muted-foreground">Sort</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="h-9 rounded-[10px] border bg-background px-3 text-sm"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {LABELS[opt]}
          </option>
        ))}
      </select>
    </label>
  );
}
