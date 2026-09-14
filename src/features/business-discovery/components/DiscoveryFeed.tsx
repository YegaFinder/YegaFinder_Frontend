"use client";

import { useState } from "react";
import { useBusinesses } from "../api/hooks/useBusinesses";
import { useCategories } from "../api/hooks/useCategories";
import { CategoryChip } from "./CategoryChip";
import { BusinessCard } from "./BusinessCard";

export function DiscoveryFeed() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const { data, isLoading, isError } = useBusinesses({ page, limit: 10 });
  const { data: categories } = useCategories();

  const items = data?.items ?? [];
  const filtered = categoryId
    ? items.filter((b) => b.businessCategories?.some((c) => c.id === categoryId))
    : items;

  return (
    <div className="space-y-4">
      <CategoryChip categories={categories ?? []} activeId={categoryId} onSelect={setCategoryId} />

      {isLoading && <p className="text-muted-foreground">Loading businesses…</p>}
      {isError && <p className="text-destructive">Couldn&apos;t load businesses.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>

      {data && (
        <div className="flex justify-center gap-2 pt-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border rounded-md text-sm disabled:opacity-50">
            Previous
          </button>
          <span className="text-sm text-muted-foreground">Page {data.page} of {data.totalPages}</span>
          <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded-md text-sm disabled:opacity-50">
            Next
          </button>
        </div>
      )}
    </div>
  );
}