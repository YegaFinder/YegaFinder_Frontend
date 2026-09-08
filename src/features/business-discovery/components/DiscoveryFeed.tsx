"use client";

import { useState } from "react";
import { useBusinesses } from "../api/hooks/useBusinesses";
import { CategoryChip } from "./CategoryChip";
import { BusinessCard } from "./BusinessCard";
import type { BusinessListItem } from "@/types/business.types";


export function DiscoveryFeed() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { data, isLoading, isError } = useBusinesses({ category });

  return (
    <div className="space-y-4">
      <CategoryChip activeSlug={category} onSelect={setCategory} />

      {isLoading && <p className="text-muted-foreground">Loading businesses…</p>}
      {isError && <p className="text-destructive">Couldn&apos;t load businesses.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data?.map((business: BusinessListItem) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
}
