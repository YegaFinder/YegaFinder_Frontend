"use client";

import { cn } from "@/lib/utils";
import type { ListingCategory } from "../types/listing.types";

interface CategoryChipProps {
  categories: ListingCategory[];
  activeId?: string;
  onSelect: (id: string | undefined) => void;
}

// No GET /categories endpoint exists on the backend yet, so this now
// receives categories as a prop (derived from fetched listings in
// DiscoveryFeed) instead of fetching them itself. Swap back to a real
// fetch once backend ships one.
export function CategoryChip({ categories, activeId, onSelect }: CategoryChipProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect(undefined)}
        className={cn(
          "shrink-0 rounded-full border px-4 py-1.5 text-sm",
          !activeId ? "bg-primary text-primary-foreground" : "bg-background"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm",
            activeId === cat.id ? "bg-primary text-primary-foreground" : "bg-background"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
