"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { merchantBookingsApi } from "../api/merchant-bookings.api";
import { getErrorMessage } from "@/lib/errors";
import { MERCHANT_BOOKINGS_QUERY_KEY } from "./useMerchantBookings";
import type { MerchantBooking, BookingDecision } from "../types/merchant-booking.types";
import type { PaginatedResponse } from "@/types/api.types";

/**
 * Accept/reject a single booking with an optimistic update, so clicking
 * "Accept" flips the row's status instantly instead of waiting a full
 * round trip — this list is exactly the kind of thing a merchant checks
 * on their phone between customers, where a laggy-feeling button is worse
 * than most other kinds of slow.
 *
 * The booking being decided might be sitting in several cached pages at
 * once (different status-tab filters, different page numbers all cached
 * simultaneously by react-query) — onMutate patches every one of them
 * that contains this booking, onError restores the exact snapshot taken
 * beforehand, and onSettled refetches everything regardless of outcome so
 * the cache can't drift from the server's actual state for long.
 */
export function useBookingDecision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: BookingDecision }) =>
      merchantBookingsApi.decideBooking(id, decision),

    onMutate: async ({ id, decision }) => {
      await queryClient.cancelQueries({ queryKey: MERCHANT_BOOKINGS_QUERY_KEY });

      const previous = queryClient.getQueriesData<PaginatedResponse<MerchantBooking>>({
        queryKey: MERCHANT_BOOKINGS_QUERY_KEY,
      });

      queryClient.setQueriesData<PaginatedResponse<MerchantBooking>>(
        { queryKey: MERCHANT_BOOKINGS_QUERY_KEY },
        (page) => {
          if (!page) return page;
          return {
            ...page,
            data: page.data.map((booking) => (booking.id === id ? { ...booking, status: decision } : booking)),
          };
        },
      );

      // Handed to onError so it can restore exactly this, not a guess.
      return { previous };
    },

    onError: (error, _variables, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      toast.error(
        getErrorMessage(error, {
          409: "This booking was already updated elsewhere — refreshing to show the current state.",
        }),
      );
    },

    onSuccess: (_data, { decision }) => {
      toast.success(decision === "confirmed" ? "Booking accepted." : "Booking declined.");
    },

    // Runs after either outcome — reconciles the optimistic guess (or the
    // rollback) with whatever the server actually has, so a booking that
    // moves between status tabs shows up correctly wherever it lands.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MERCHANT_BOOKINGS_QUERY_KEY });
    },
  });
}