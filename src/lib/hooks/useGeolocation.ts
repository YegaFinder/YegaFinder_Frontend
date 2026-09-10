"use client";

import { useCallback, useState } from "react";

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export type GeolocationStatus = "idle" | "locating" | "success" | "error";

interface UseGeolocationResult {
  coords: GeolocationCoords | null;
  status: GeolocationStatus;
  error: string | null;
  /** Kicks off (or retries) a browser geolocation request. Call this from a
   * user gesture (e.g. an "Use my location" button) — most browsers block
   * the permission prompt if it fires on mount with no interaction. */
  locate: () => void;
}

const ERROR_MESSAGES: Record<number, string> = {
  1: "Location access was denied. You can allow it in your browser's site settings, or search by address instead.",
  2: "Your location couldn't be determined. Please try again or search by address.",
  3: "Location request timed out. Please try again.",
};

/**
 * Wraps the browser's Geolocation API in the loading/error shape the rest
 * of the app expects from a query-like hook. Deliberately NOT a
 * react-query hook — there's no server round trip, and geolocation
 * permission prompts need to be tied to explicit user action rather than
 * to query caching/retry behavior.
 *
 * Used by /nearby (map center + "near me" pin) and reusable by /search's
 * distance sort once that lands.
 */
export function useGeolocation(): UseGeolocationResult {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setStatus("error");
      setError("Geolocation isn't supported in this browser. Please search by address instead.");
      return;
    }

    setStatus("locating");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setStatus("success");
      },
      (positionError) => {
        setStatus("error");
        setError(ERROR_MESSAGES[positionError.code] ?? "Couldn't get your location. Please try again.");
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }, []);

  return { coords, status, error, locate };
}
