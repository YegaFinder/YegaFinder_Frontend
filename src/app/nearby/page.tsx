"use client";

import { useMemo, useState } from "react";
import { MapView } from "@/components/shared/map-view";
import { FilterBar, type FilterBarValue } from "@/components/shared/filter-bar";
import { SortDropdown, type SortOption } from "@/components/shared/sort-dropdown";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useNearbyBusinesses } from "@/features/business-discovery/api/hooks/useNearbyBusinesses";
import { useCategories } from "@/features/business-discovery/api/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import type { NearbyListing } from "@/types/business.types";

const FALLBACK_CENTER = { latitude: 9.03, longitude: 38.74 };

function categoryLabel(business: NearbyListing) {
  return business.businessCategories[0]?.name ?? "Uncategorized";
}

export default function NearbyPage() {
  const { coords, status, error, locate } = useGeolocation();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const [filters, setFilters] = useState<FilterBarValue>({});
  const [sort, setSort] = useState<SortOption>("distance");
  const [activeId, setActiveId] = useState<string | undefined>();

  const center = coords ?? FALLBACK_CENTER;

  const nearbyParams = useMemo(
    () =>
      coords
        ? { lat: coords.latitude, lng: coords.longitude, radius: filters.maxDistanceKm }
        : null,
    [coords, filters.maxDistanceKm],
  );

  const { data, isLoading: businessesLoading } = useNearbyBusinesses(nearbyParams);

  const businesses = useMemo(() => {
    let list = data?.listings ?? [];
    if (filters.categoryId) {
      list = list.filter((b) => b.businessCategories.some((c) => c.id === filters.categoryId));
    }
    if (filters.minRating) {
      list = list.filter((b) => b.averageRating >= filters.minRating!);
    }
    return [...list].sort((a, b) => {
      if (sort === "rating") return b.averageRating - a.averageRating;
      if (sort === "name") return a.businessName.localeCompare(b.businessName);
      return a.distanceKm - b.distanceKm;
    });
  }, [data, filters.categoryId, filters.minRating, sort]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Nearby</h1>
        <Button variant="outline" size="sm" onClick={locate} disabled={status === "locating"}>
          <MapPin className="h-4 w-4" />
          {status === "locating" ? "Locating…" : "Use my location"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <FilterBar
        value={filters}
        onChange={setFilters}
        categories={categoriesData?.data ?? []}
        categoriesLoading={categoriesLoading}
      />

      <div className="flex justify-end">
        <SortDropdown value={sort} onChange={setSort} distanceAvailable={!!coords} />
      </div>

      <MapView
        center={center}
        zoom={coords ? 14 : 12}
        markers={businesses.map((b) => ({
          id: b.id,
          latitude: b.latitude ?? center.latitude,
          longitude: b.longitude ?? center.longitude,
          label: b.businessName,
          sublabel: `${categoryLabel(b)} · ${b.averageRating.toFixed(1)}★ · ${b.distanceKm.toFixed(1)} km`,
          onSelect: () => setActiveId(b.id),
        }))}
        activeMarkerId={activeId}
        className="h-96 w-full overflow-hidden rounded-[24px] border"
      />

      {!coords && status !== "locating" && (
        <p className="text-sm text-muted-foreground">
          Showing central Addis Ababa. Tap &ldquo;Use my location&rdquo; to see what&apos;s actually near you.
        </p>
      )}

      {coords && businessesLoading && <p className="text-sm text-muted-foreground">Loading nearby businesses…</p>}

      {coords && !businessesLoading && businesses.length === 0 && (
        <p className="text-sm text-muted-foreground">No businesses found nearby with these filters.</p>
      )}

      <ul className="flex flex-col gap-2">
        {businesses.map((b) => (
          <li
            key={b.id}
            onMouseEnter={() => setActiveId(b.id)}
            className={`rounded-[14px] border p-3 text-sm ${activeId === b.id ? "border-yegna-primary" : ""}`}
          >
            <div className="font-medium">{b.businessName}</div>
            <div className="text-muted-foreground">
              {categoryLabel(b)} · {b.averageRating.toFixed(1)}★ · {b.distanceKm.toFixed(1)} km
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}