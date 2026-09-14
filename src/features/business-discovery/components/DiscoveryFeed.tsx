"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBusinesses } from "../api/hooks/useBusinesses";
import { useCategories } from "../api/hooks/useCategories";
import { CategoryChip } from "./CategoryChip";
import { BusinessCard } from "./BusinessCard";

export function DiscoveryFeed() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  // Seeded from ?categoryId= so links like /businesses?categoryId=xyz
  // (e.g. from the home page's category rail) land pre-filtered.
  const [categoryId, setCategoryId] = useState<string | undefined>(
    searchParams.get("categoryId") ?? undefined,
  );
  // §4.1 — categoryId is sent to the backend so pagination totals reflect
  // the filtered set. Filtering the already-paginated page client-side
  // used to break pagination (page 2 of "All" isn't page 2 of a category).
  const { data, isLoading, isError } = useBusinesses({ page, limit: 10, categoryId });
  const { data: categories } = useCategories();

  const items = data?.items ?? [];

  function handleSelectCategory(id: string | undefined) {
    setCategoryId(id);
    setPage(1);
    router.replace(id ? `/businesses?categoryId=${id}` : "/businesses", { scroll: false });
  }

  return (
    <div className="space-y-4">
      <CategoryChip categories={categories ?? []} activeId={categoryId} onSelect={handleSelectCategory} />

      {isLoading && <p className="text-muted-foreground">Loading businesses…</p>}
      {isError && <p className="text-destructive">Couldn&apos;t load businesses.</p>}
      {!isLoading && !isError && items.length === 0 && (
        <p className="text-muted-foreground">No businesses found in this category yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((business) => (
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