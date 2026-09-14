"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";

export interface MapPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  /** Optional line shown under the name in the popup, e.g. distance or category. */
  subtitle?: string;
  href?: string;
}

interface MapViewProps {
  pins: MapPin[];
  /** Center when there are no pins yet, or as a fallback. Defaults to Addis Ababa. */
  fallbackCenter?: { lat: number; lng: number };
  height?: number | string;
  className?: string;
}

// Leaflet's default marker icon references image files by relative path,
// which breaks under Next.js/webpack bundling (the classic "marker icon
// 404" issue). Sidestepping it entirely with a small inline SVG divIcon
// instead of touching L.Icon.Default — no image assets required.
const pinIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
    background: linear-gradient(135deg, #f97316, #ea580c);
    transform: rotate(-45deg);
    display:flex; align-items:center; justify-content:center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.35);
  "><div style="
    width: 10px; height: 10px; border-radius: 50%; background: white;
    transform: rotate(45deg);
  "></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

const ADDIS_ABABA = { lat: 9.0192, lng: 38.7525 };

/** Re-centers the map whenever the pin set changes (e.g. radius filter changes). */
function RecenterOnPins({ pins, fallbackCenter }: { pins: MapPin[]; fallbackCenter: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (pins.length === 0) {
      map.setView([fallbackCenter.lat, fallbackCenter.lng], 12);
      return;
    }
    if (pins.length === 1) {
      map.setView([pins[0].latitude, pins[0].longitude], 14);
      return;
    }
    const bounds = L.latLngBounds(pins.map((p) => [p.latitude, p.longitude] as [number, number]));
    map.fitBounds(bounds, { padding: [32, 32] });
  }, [pins, fallbackCenter, map]);

  return null;
}

export function MapView({ pins, fallbackCenter = ADDIS_ABABA, height = 360, className }: MapViewProps) {
  const center = pins[0] ? { lat: pins[0].latitude, lng: pins[0].longitude } : fallbackCenter;

  return (
    <div
      className={className}
      style={{ height, width: "100%", borderRadius: "12px", overflow: "hidden" }}
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterOnPins pins={pins} fallbackCenter={fallbackCenter} />
        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.latitude, pin.longitude]} icon={pinIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-medium">{pin.name}</p>
                {pin.subtitle && <p className="text-xs text-muted-foreground">{pin.subtitle}</p>}
                {pin.href && (
                  <a href={pin.href} className="text-xs text-yegna-primary underline">
                    View business
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}