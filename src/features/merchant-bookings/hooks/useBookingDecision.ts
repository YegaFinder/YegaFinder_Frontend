"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { merchantBookingsApi } from "../api/merchant-bookings.api";
import { getErrorMessage } from "@/lib/errors";
import { MERCHANT_BOOKINGS_QUERY_KEY } from "./useMerchantBookings";
import { DECISION_RESULT_STATUS } from "../types/merchant-booking.types";
import type { MerchantBooking, BookingDecision } from "../types/merchant-booking.types";

/**
 * Same optimistic-update-with-rollback shape as before, adjusted for the
 * real cache shape: a plain MerchantBooking[] now, not a PaginatedResponse,
 * since GET /bookings/merchant returns a bare array with no meta/pages.
 */
export function useBookingDecision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: BookingDecision }) =>
      merchantBookingsApi.decideBooking(id, decision),

    onMutate: async ({ id, decision }) => {
      await queryClient.cancelQueries({ queryKey: MERCHANT_BOOKINGS_QUERY_KEY });

      const previous = queryClient.getQueryData<MerchantBooking[]>(MERCHANT_BOOKINGS_QUERY_KEY);

      queryClient.setQueryData<MerchantBooking[]>(MERCHANT_BOOKINGS_QUERY_KEY, (old) =>
        old?.map((b) => (b.id === id ? { ...b, status: DECISION_RESULT_STATUS[decision] } : b)),
      );

      return { previous };
    },

    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(MERCHANT_BOOKINGS_QUERY_KEY, context.previous);
      }
      toast.error(
        getErrorMessage(error, {
          409: "This booking was already updated elsewhere — refreshing to show the current state.",
        }),
      );
    },

    onSuccess: (_data, { decision }) => {
      toast.success(decision === "accept" ? "Booking accepted." : "Booking declined.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MERCHANT_BOOKINGS_QUERY_KEY });
    },
  });
}