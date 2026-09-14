"use client";

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