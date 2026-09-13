"use client";

import { useEffect, useMemo, useState } from "react";
import { useListings } from "@/features/business-discovery/api/hooks/useListings";
import { haversineDistanceKm } from "../utils/distance";
import type { Listing } from "@/features/business-discovery/types/listing.types";

export interface NearbyListing extends Listing {
  distanceKm: number | null;
}

type GeoStatus = "idle" | "loading" | "granted" | "denied" | "unsupported" | "error";

// No /businesses/nearby endpoint exists on the backend (confirmed - no
// nearby/geo/distance controller anywhere in source). This computes
// distance entirely client-side against the same /listings data
// SearchFeed already fetches, the same "client-side over the full
// payload" pattern used elsewhere in this project.
export function useNearbyListings() {
  const { data, isLoading: listingsLoading, isError: listingsError } = useListings();
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeoStatus("unsupported");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGeoStatus("granted");
      },
      (err) => {
        setGeoStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  const listings = useMemo<NearbyListing[]>(() => {
    const raw = data?.listings ?? [];

    if (!coords) {
      return raw.map((listing) => ({ ...listing, distanceKm: null }));
    }

    return raw
      .map((listing) => {
        const distanceKm =
          listing.latitude != null && listing.longitude != null
            ? haversineDistanceKm(coords.latitude, coords.longitude, listing.latitude, listing.longitude)
            : null;
        return { ...listing, distanceKm };
      })
      .sort((a, b) => {
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
  }, [data, coords]);

  return {
    listings,
    isLoading: listingsLoading || geoStatus === "loading" || geoStatus === "idle",
    isError: listingsError,
    geoStatus,
  };
}