"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { merchantBookingsApi } from "../api/merchant-bookings.api";
import type { BookingStatus } from "../types/merchant-booking.types";

export const MERCHANT_BOOKINGS_QUERY_KEY = ["merchant-bookings"] as const;

/**
 * GET /bookings/merchant returns every booking at once — no page/limit or
 * status-filter query parameters are documented for it — so unlike the
 * original version, there's no server round trip per tab switch. Fetch
 * once, filter client-side. Simpler than before, and more honest about
 * what the backend actually supports.
 */
export function useMerchantBookings() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | undefined>("PENDING");

  const query = useQuery({
    queryKey: MERCHANT_BOOKINGS_QUERY_KEY,
    queryFn: merchantBookingsApi.getMerchantBookings,
  });

  const bookings = useMemo(() => {
    const all = query.data ?? [];
    if (!statusFilter) return all;
    return all.filter((b) => b.status === statusFilter);
  }, [query.data, statusFilter]);

  return {
    bookings,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    statusFilter,
    setStatusFilter,
  };
}