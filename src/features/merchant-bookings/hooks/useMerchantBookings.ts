"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { merchantBookingsApi } from "../api/merchant-bookings.api";
import type { BookingStatus } from "../types/merchant-booking.types";

export const MERCHANT_BOOKINGS_QUERY_KEY = ["merchant-bookings"] as const;

/**
 * Backs the bookings dashboard. Owns both the page number and the active
 * status tab itself (same pattern as useMyListings) so BookingsTable can
 * stay a dumb rendering component — it just calls setStatusFilter/setPage
 * and re-renders with whatever comes back.
 *
 * Switching status tabs resets to page 1: staying on, say, page 3 of
 * "pending" and then flipping to "confirmed" would almost certainly land
 * on an empty or nonsensical page for the new filter.
 */
export function useMerchantBookings(pageSize = 10) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | undefined>("pending");

  const query = useQuery({
    queryKey: [...MERCHANT_BOOKINGS_QUERY_KEY, statusFilter, page, pageSize],
    queryFn: () => merchantBookingsApi.getMyBookings({ status: statusFilter, page, pageSize }),
    placeholderData: (prev) => prev,
  });

  function changeStatusFilter(next: BookingStatus | undefined) {
    setStatusFilter(next);
    setPage(1);
  }

  return {
    bookings: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    page,
    setPage,
    statusFilter,
    setStatusFilter: changeStatusFilter,
  };
}