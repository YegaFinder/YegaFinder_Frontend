"use client";

import { useCategories } from "../api/hooks/useCategories";
import { cn } from "@/lib/utils";

interface CategoryChipProps {
  activeSlug?: string;
  onSelect: (slug: string | undefined) => void;
}

export function CategoryChip({ activeSlug, onSelect }: CategoryChipProps) {
  const { data, isLoading } = useCategories();
  const categories = data?.data ?? [];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect(undefined)}
        className={cn(
          "shrink-0 rounded-full border px-4 py-1.5 text-sm",
          !activeSlug ? "bg-primary text-primary-foreground" : "bg-background"
        )}
      >
        All
      </button>
      {isLoading && <span className="text-sm text-muted-foreground px-2">Loading…</span>}
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm",
            activeSlug === cat.id ? "bg-primary text-primary-foreground" : "bg-background"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}