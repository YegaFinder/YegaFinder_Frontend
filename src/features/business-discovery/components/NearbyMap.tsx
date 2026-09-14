"use client";

import { useState } from "react";
import { useGeolocation } from "../api/hooks/useGeolocation";
import { useNearbyBusinesses } from "../api/hooks/useNearbyBusinesses";
import { BusinessCard } from "./BusinessCard";

const RADIUS_OPTIONS = [5, 10, 25, 50] as const;

export function NearbyMap() {
  const { coords, permissionDenied } = useGeolocation();
  const [radius, setRadius] = useState<number>(10);

  const params = coords ? { lat: coords.lat, lng: coords.lng, radius, page: 1, limit: 20 } : null;
  const { data, isLoading, isError } = useNearbyBusinesses(params);

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
      <div className="flex items-center gap-2">
        <label htmlFor="radius" className="text-sm font-medium">
          Within
        </label>
        <select
          id="radius"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          {RADIUS_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r} km
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Finding businesses near you...</p>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">Could not load nearby businesses. Try again.</p>
      ) : !data?.items.length ? (
        <p className="text-sm text-muted-foreground">
          No businesses found within {radius} km. Try a wider radius.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((b) => (
            <BusinessCard key={b.id} business={b} distanceKm={b.distanceKm} />
          ))}
        </div>
      )}
    </div>
  );
}
