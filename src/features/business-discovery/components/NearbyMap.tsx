"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useGeolocation } from "../api/hooks/useGeolocation";
import { useNearbyBusinesses } from "../api/hooks/useNearbyBusinesses";
import { BusinessCard } from "./BusinessCard";
import { FilterBar } from "@/components/shared/filter-bar";
import { SortDropdown, sortBusinesses, type SortOption } from "@/components/shared/sort-dropdown";
import type { MapPin } from "@/components/shared/map-view";

// Leaflet reads `window`/`document` at import time — must never run during
// Next's server render pass, so it's loaded client-only via next/dynamic
// rather than a plain top-level import.
const MapView = dynamic(() => import("@/components/shared/map-view").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full animate-pulse rounded-xl bg-muted" />
  ),
});

const RADIUS_OPTIONS = [5, 10, 25, 50] as const;

export function NearbyMap() {
  const { coords, permissionDenied } = useGeolocation();
  const [radius, setRadius] = useState<number>(10);
  const [sort, setSort] = useState<SortOption>("distance");

  const params = coords ? { lat: coords.lat, lng: coords.lng, radius, page: 1, limit: 20 } : null;
  const { data, isLoading, isError } = useNearbyBusinesses(params);

  const sortedItems = useMemo(
    () => (data?.items ? sortBusinesses(data.items, sort) : []),
    [data?.items, sort],
  );

  const pins: MapPin[] = useMemo(
    () =>
      sortedItems
        .filter((b) => b.latitude != null && b.longitude != null)
        .map((b) => ({
          id: b.id,
          name: b.businessName,
          latitude: b.latitude!,
          longitude: b.longitude!,
          subtitle: b.distanceKm != null ? `${b.distanceKm.toFixed(1)} km away` : undefined,
          href: `/businesses/${b.id}`,
        })),
    [sortedItems],
  );

  if (permissionDenied) {
    return (
      <p className="text-sm text-muted-foreground">
        Location access was denied. Enable location in your browser settings to see nearby businesses.
      </p>
    );
  }

  if (!coords) {
    return <p className="text-sm text-muted-foreground">Getting your location...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterBar
          radiusOptions={RADIUS_OPTIONS}
          radius={radius}
          onRadiusChange={(r) => setRadius(r ?? 10)}
          radiusRequired
        />
        <SortDropdown value={sort} onChange={setSort} includeDistance />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Finding businesses near you...</p>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">Could not load nearby businesses. Try again.</p>
      ) : !sortedItems.length ? (
        <p className="text-sm text-muted-foreground">
          No businesses found within {radius} km. Try a wider radius.
        </p>
      ) : (
        <>
          <MapView pins={pins} fallbackCenter={{ lat: coords.lat, lng: coords.lng }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedItems.map((b) => (
              <BusinessCard key={b.id} business={b} distanceKm={b.distanceKm} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}