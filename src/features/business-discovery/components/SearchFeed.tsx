"use client";

import { useState } from "react";
import { useBusinessSearch } from "../api/hooks/useBusinessSearch";
import { BusinessCard } from "./BusinessCard";

export function SearchFeed() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useBusinessSearch({ q: query, page, limit: 10 });

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
        placeholder="Search businesses..."
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {isError && <p className="text-destructive">Couldn&apos;t load businesses.</p>}
      {!isLoading && query && data?.items.length === 0 && (
        <p className="text-muted-foreground">No businesses match &quot;{query}&quot;.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data?.items ?? []).map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
}