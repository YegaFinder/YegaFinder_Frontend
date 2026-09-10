"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessListingsApi } from "../api/business-listings.api";

export const MY_LISTINGS_QUERY_KEY = ["business-listings", "mine"] as const;

/** Backs the "My Listings" table — owns its own page state so the table stays simple. */
export function useMyListings(pageSize = 10) {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: [...MY_LISTINGS_QUERY_KEY, page, pageSize],
    queryFn: () => businessListingsApi.getMyListings({ page, pageSize }),
    placeholderData: (prev) => prev,
  });

  return {
    listings: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    page,
    setPage,
    refetch: query.refetch,
  };
}