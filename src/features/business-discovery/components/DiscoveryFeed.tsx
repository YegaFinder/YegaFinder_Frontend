"use client";

import { useMemo, useState } from "react";
import { useListings } from "../api/hooks/useListings";
import { CategoryChip } from "./CategoryChip";
import { BusinessCard } from "./BusinessCard";
import type { ListingCategory } from "../types/listing.types";

function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3 animate-pulse">
      <div className="h-32 rounded-md bg-muted" />
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-3 w-1/2 rounded bg-muted" />
    </div>
  );
}

export function DiscoveryFeed() {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const { data, isLoading, isError, refetch, isRefetching } = useListings();
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

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border p-6 text-center space-y-3">
          <p className="text-destructive text-sm">Couldn&apos;t load businesses.</p>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
          >
            {isRefetching ? "Retrying…" : "Try again"}
          </button>
        </div>
      )}

      {!isLoading && !isError && filteredListings.length === 0 && (
        <div className="rounded-lg border p-8 text-center space-y-1">
          <p className="text-muted-foreground">No businesses to show.</p>
          {categoryId && (
            <button
              type="button"
              onClick={() => setCategoryId(undefined)}
              className="text-sm underline text-muted-foreground hover:text-foreground"
            >
              Clear category filter
            </button>
          )}
        </div>
      )}

      {!isLoading && !isError && filteredListings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((listing) => (
            <BusinessCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
