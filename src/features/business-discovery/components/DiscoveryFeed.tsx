"use client";

import { useMemo, useState } from "react";
import { useListings } from "../api/hooks/useListings";
import { CategoryChip } from "./CategoryChip";
import { BusinessCard } from "./BusinessCard";
import type { ListingCategory } from "../types/listing.types";

export function DiscoveryFeed() {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const { data, isLoading, isError } = useListings();
  const listings = data?.listings ?? [];

  const availableCategories = useMemo(() => {
    const seen = new Map<string, ListingCategory>();
    for (const listing of listings) {
      for (const cat of listing.businessCategories ?? []) {
        seen.set(cat.id, cat);
      }
    }
    return Array.from(seen.values());
  }, [listings]);

  const filteredListings = categoryId
    ? listings.filter((l) => l.businessCategories?.some((c) => c.id === categoryId))
    : listings;

  return (
    <div className="space-y-4">
      <CategoryChip categories={availableCategories} activeId={categoryId} onSelect={setCategoryId} />

      {isLoading && <p className="text-muted-foreground">Loading businesses…</p>}
      {isError && <p className="text-destructive">Couldn&apos;t load businesses.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map((listing) => (
          <BusinessCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
