"use client";

import { useMemo, useState } from "react";
import { useBusinesses } from "../api/hooks/useBusinesses";
import { useCategories } from "../api/hooks/useCategories";
import { useGeolocation } from "../api/hooks/useGeolocation";
import { BusinessCard } from "./BusinessCard";
import { FilterBar } from "@/components/shared/filter-bar";
import { SortDropdown, sortBusinesses, type SortOption } from "@/components/shared/sort-dropdown";

const RADIUS_OPTIONS = [5, 10, 25, 50] as const;

export function SearchFeed() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string>("");
  const [radius, setRadius] = useState<number | null>(null); // null = distance filter off
  const [sort, setSort] = useState<SortOption>("relevance");

  const { coords, permissionDenied } = useGeolocation();
  const { data: categories } = useCategories();

  const useDistance = radius !== null && !!coords;

  const { data, isLoading, isError } = useBusinesses({
    q: query || undefined,
    page,
    limit: 10,
    categoryId: categoryId || undefined,
    ...(useDistance && coords ? { lat: coords.lat, lng: coords.lng, radius } : {}),
  });

  const sortedItems = useMemo(
    () => (data?.items ? sortBusinesses(data.items, sort) : []),
    [data?.items, sort],
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        placeholder="Search businesses..."
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterBar
          categories={categories ?? []}
          categoryId={categoryId}
          onCategoryChange={(id) => { setCategoryId(id ?? ""); setPage(1); }}
          radiusOptions={RADIUS_OPTIONS}
          radius={radius}
          onRadiusChange={(r) => { setRadius(r); setPage(1); }}
          radiusDisabled={!coords}
          radiusDisabledReason={!coords ? (permissionDenied ? "Location access denied" : "Waiting for location…") : undefined}
        />
        <SortDropdown value={sort} onChange={setSort} includeDistance={useDistance} />
      </div>

      {!coords && permissionDenied && (
        <p className="text-xs text-muted-foreground">
          Enable location access to filter by distance.
        </p>
      )}

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {isError && <p className="text-destructive">Couldn&apos;t load businesses.</p>}
      {!isLoading && sortedItems.length === 0 && (
        <p className="text-muted-foreground">No businesses match your filters.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedItems.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
}