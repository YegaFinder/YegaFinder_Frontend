"use client";

import { BusinessCard } from "@/features/business-discovery/components/BusinessCard";
import { useNearbyListings } from "../hooks/useNearbyListings";

function formatDistance(distanceKm: number): string {
  return distanceKm < 1
    ? `${Math.round(distanceKm * 1000)} m away`
    : `${distanceKm.toFixed(1)} km away`;
}

export function NearbyFeed() {
  const { listings, isLoading, isError, geoStatus } = useNearbyListings();

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        Finding businesses near you...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="py-16 text-center text-sm text-destructive">
        We couldn&apos;t load nearby businesses.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {geoStatus === "denied" && (
        <p className="text-sm text-muted-foreground">
          Location access was denied - showing all businesses, unsorted by distance.
        </p>
      )}
      {geoStatus === "error" && (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t determine your location - showing all businesses, unsorted by distance.
        </p>
      )}
      {geoStatus === "unsupported" && (
        <p className="text-sm text-muted-foreground">
          Your browser doesn&apos;t support location - showing all businesses.
        </p>
      )}

      {listings.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">No businesses found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <div key={listing.id} className="space-y-1">
              <BusinessCard listing={listing} />
              {listing.distanceKm != null && (
                <p className="px-1 text-xs text-muted-foreground">{formatDistance(listing.distanceKm)}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}