"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  label: string;
  /** Optional short line shown under the label in the marker popup (e.g. category + rating). */
  sublabel?: string;
  onSelect?: () => void;
}

interface MapViewProps {
  center: { latitude: number; longitude: number };
  markers?: MapMarker[];
  /** Leaflet zoom level. 13 ≈ a city district, 15 ≈ a few blocks. Defaults to 14. */
  zoom?: number;
  className?: string;
  /** Marker id to visually distinguish (e.g. the business the user is hovering in a list). */
  activeMarkerId?: string;
}

/**
 * Reusable Google-Maps-or-OSM wrapper (V1 Sprint Plan's language) — built on
 * Leaflet + OpenStreetMap tiles so it needs no API key, matching the choice
 * already made in src/lib/geocode.ts. If the product later needs Google's
 * richer POI data, only this file and geocode.ts need to change — every
 * caller (currently just /nearby) stays the same.
 *
 * react-leaflet touches `window` at import time, which breaks SSR/RSC.
 * The dynamic()+ssr:false below is done ONCE, here, so every consumer of
 * MapView can just import and render it like a normal component.
 */
const LeafletMap = dynamic(() => import("./map-view-leaflet"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted/40 text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

export function MapView({ center, markers = [], zoom = 14, className, activeMarkerId }: MapViewProps) {
  // Keep a stable reference so LeafletMap doesn't re-render on every parent
  // render when the caller passes an inline array literal.
  const stableMarkers = useMemo(() => markers, [markers]);

  return (
    <div className={className ?? "h-80 w-full overflow-hidden rounded-[24px] border"}>
      <LeafletMap center={center} markers={stableMarkers} zoom={zoom} activeMarkerId={activeMarkerId} />
    </div>
  );
}
