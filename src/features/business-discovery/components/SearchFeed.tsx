"use client";

import { useMemo, useState } from "react";
import { useListings } from "../api/hooks/useListings";
import { BusinessCard } from "./BusinessCard";
import type { Listing } from "../types/listing.types";

type SortOption = "rating" | "name";

// Local, self-contained filter/sort UI for now — swap to the shared
// FilterBar/SortDropdown components once that PR actually merges.
// Client-side only: backend has no /search endpoint yet, and /listings
// already returns the full unpaginated set, so filtering/sorting here
// is a real working search, not a placeholder.
export function SearchFeed() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("rating");
  const { data, isLoading, isError } = useListings();

  const listings = useMemo(() => data?.listings ?? [], [data]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = listings;

    if (q) {
      filtered = filtered.filter(
        (l) =>
          l.businessName.toLowerCase().includes(q) ||
          l.description?.toLowerCase().includes(q) ||
          l.businessCategories?.some((c) => c.name.toLowerCase().includes(q))
      );
    }

    return [...filtered].sort((a, b) =>
      sort === "rating"
        ? b.averageRating - a.averageRating
        : a.businessName.localeCompare(b.businessName)
    );
  }, [listings, query, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search businesses..."
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="rating">Sort: Highest rated</option>
          <option value="name">Sort: Name (A-Z)</option>
        </select>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {isError && <p className="text-destructive">Couldn&apos;t load businesses.</p>}
      {!isLoading && results.length === 0 && (
        <p className="text-muted-foreground">No businesses match &quot;{query}&quot;.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((listing: Listing) => (
          <BusinessCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
