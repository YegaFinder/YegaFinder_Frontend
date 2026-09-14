"use client";

import { cn } from "@/lib/utils";
import type { BusinessCategory } from "@/types/business.types";

interface CategoryChipProps {
  categories: BusinessCategory[];
  activeId?: string;
  onSelect: (id: string | undefined) => void;
}

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