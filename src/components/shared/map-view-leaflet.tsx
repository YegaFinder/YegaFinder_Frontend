"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import type { MapMarker } from "./map-view";

// Leaflet's default marker icon references image paths that don't survive
// a bundler (webpack/Turbopack rewrite the URLs). Point it at the CDN copy
// that ships in the installed leaflet version instead of the broken
// relative path — this only needs to run once per page load.
const DEFAULT_ICON = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const ACTIVE_ICON = L.icon({
  ...DEFAULT_ICON.options,
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  className: "brightness-125 saturate-150",
});

interface RecenterProps {
  center: { latitude: number; longitude: number };
}

/** MapContainer only reads `center` on first mount — this keeps the view
 * following it if the caller updates the center prop later (e.g. after a
 * fresh geolocation fix comes in). */
function Recenter({ center }: RecenterProps) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.latitude, center.longitude]);
  }, [center.latitude, center.longitude, map]);
  return null;
}

// Production note: the default openstreetmap.org tile server is meant for
// light/demo traffic and can rate-limit or block a domain that sends real
// production volume (see https://operations.osmfoundation.org/policies/tiles/).
// Same caution as geocode.ts's Nominatim note — if /nearby usage grows,
// swap in a paid tile provider (MapTiler, Mapbox, Stadia) or Google Maps
// here; only this one file needs to change.
export default function LeafletMapImpl({
  center,
  markers,
  zoom,
  activeMarkerId,
}: {
  center: { latitude: number; longitude: number };
  markers: MapMarker[];
  zoom: number;
  activeMarkerId?: string;
}) {
  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={zoom}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <Recenter center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.latitude, marker.longitude]}
          icon={marker.id === activeMarkerId ? ACTIVE_ICON : DEFAULT_ICON}
          eventHandlers={marker.onSelect ? { click: marker.onSelect } : undefined}
        >
          <Popup>
            <div className="text-sm font-medium">{marker.label}</div>
            {marker.sublabel && <div className="text-xs text-muted-foreground">{marker.sublabel}</div>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
