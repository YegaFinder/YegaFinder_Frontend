"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "../booking.api";

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["bookings", "merchant"] });

  const accept = useMutation({
    mutationFn: (bookingId: string) =>
      bookingApi.updateBookingStatus(bookingId, { status: "ACCEPTED" }),
    onSuccess: invalidate,
  });

  const reject = useMutation({
    mutationFn: (bookingId: string) =>
      bookingApi.updateBookingStatus(bookingId, { status: "REJECTED" }),
    onSuccess: invalidate,
  });

  return {
    accept: accept.mutate,
    isAccepting: accept.isPending,
    reject: reject.mutate,
    isRejecting: reject.isPending,
  };
}