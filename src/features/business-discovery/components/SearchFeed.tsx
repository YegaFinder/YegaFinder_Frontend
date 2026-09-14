"use client";

<<<<<<< HEAD
import { useMemo, useState } from "react";
import { useSearchListings } from "../api/hooks/useSearchListings";
import { useCategories } from "../api/hooks/useCategories";
import { BusinessCard } from "./BusinessCard";
import { FilterBar, type FilterBarValue } from "@/components/shared/filter-bar";
import { SortDropdown, type SortOption } from "@/components/shared/sort-dropdown";
import type { Listing } from "../types/listing.types";

/**
 * FIXED: this used to keep its own local filter/sort UI with a comment
 * saying "swap to the shared FilterBar/SortDropdown once that PR merges"
 * — it never did, which meant the shared Sprint 4 geo/filter infra
 * (built specifically to be reused by both /search and /nearby) only
 * ever had one consumer. Now uses the same components /nearby uses.
 *
 * Also FIXED: the old comment here claimed "backend has no /search
 * endpoint yet" and "/listings already returns the full unpaginated
 * set" — both false. GET /listings/search?q= exists and is public
 * (YegnaFinder_Backend_Reference.md §7.2), and GET /listings is
 * paginated (§7.1). This now calls the real search endpoint with a
 * server-side query instead of client-filtering whatever happened to be
 * on page 1 of the plain listings feed — the old approach would quietly
 * miss businesses as the catalog grows past one page.
 *
 * Distance and "open now" aren't wired up here: /search has no user
 * coordinates to sort/filter by, and this feature's local Listing type
 * (types/listing.types.ts) types businessHours as `unknown[]`, so
 * there's nothing typed to check "is this open now" against. FilterBar
 * hides both sections via hideDistance/hideOpenNow rather than faking
 * controls that can't actually do anything.
 */
export function SearchFeed() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterBarValue>({});
  const [sort, setSort] = useState<SortOption>("rating");

  const { data, isLoading, isError } = useSearchListings(query);
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const listings = useMemo(() => data?.listings ?? [], [data]);

  const results = useMemo(() => {
    let filtered = listings;

    if (filters.minRating) {
      filtered = filtered.filter((l) => l.averageRating >= filters.minRating!);
    }

    return [...filtered].sort((a, b) =>
      sort === "rating" ? b.averageRating - a.averageRating : a.businessName.localeCompare(b.businessName),
    );
  }, [listings, filters.minRating, sort]);
=======
import { useState } from "react";
import { useBusinesses } from "../api/hooks/useBusinesses";
import { useCategories } from "../api/hooks/useCategories";
import { useGeolocation } from "../api/hooks/useGeolocation";
import { BusinessCard } from "./BusinessCard";

const RADIUS_OPTIONS = [5, 10, 25, 50] as const;

export function SearchFeed() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string>("");
  const [radius, setRadius] = useState<number | null>(null); // null = distance filter off

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

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
<<<<<<< HEAD
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search businesses..."
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <FilterBar
          value={filters}
          onChange={setFilters}
          categories={categoriesData?.data ?? []}
          categoriesLoading={categoriesLoading}
          hideDistance
          hideOpenNow
          className="flex-1"
        />
        <SortDropdown value={sort} onChange={setSort} distanceAvailable={false} />
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {isError && <p className="text-destructive">Couldn&apos;t load businesses.</p>}
      {!isLoading && !isError && results.length === 0 && (
        <p className="text-muted-foreground">
          {query.trim() ? <>No businesses match &quot;{query}&quot;.</> : "No businesses found."}
        </p>
=======
        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        placeholder="Search businesses..."
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      <div className="flex flex-wrap gap-3">
        <select
          value={categoryId}
          onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {(categories ?? []).map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={radius ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setRadius(value === "" ? null : Number(value));
            setPage(1);
          }}
          disabled={!coords}
          title={!coords ? (permissionDenied ? "Location access denied" : "Waiting for location…") : undefined}
          className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
        >
          <option value="">Any distance</option>
          {RADIUS_OPTIONS.map((r) => (
            <option key={r} value={r}>Within {r} km</option>
          ))}
        </select>
      </div>

      {!coords && permissionDenied && (
        <p className="text-xs text-muted-foreground">
          Enable location access to filter by distance.
        </p>
      )}

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {isError && <p className="text-destructive">Couldn&apos;t load businesses.</p>}
      {!isLoading && data?.items.length === 0 && (
        <p className="text-muted-foreground">No businesses match your filters.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data?.items ?? []).map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
}