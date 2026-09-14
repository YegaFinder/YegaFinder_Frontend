"use client";

import { useEffect, useState } from "react";

interface Coords {
  lat: number;
  lng: number;
}

/**
 * Requests the browser's current position once on mount. Used to power
 * the "Nearby" section on the home feed (§4.3). Silently resolves to
 * `null` on denial/unsupported browsers/error — nearby is a nice-to-have
 * on the home feed, not something that should block the rest of the page.
 */
export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) setPermissionDenied(true);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  return { coords, permissionDenied };
}