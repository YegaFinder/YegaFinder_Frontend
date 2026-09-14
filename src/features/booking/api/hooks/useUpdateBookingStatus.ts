import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingApi } from "../booking.api";
import { getErrorMessage } from "@/lib/errors";
import type { UpdateBookingStatusRequest } from "../../types/booking.types";

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, payload }: { bookingId: string; payload: UpdateBookingStatusRequest }) =>
      bookingApi.updateBookingStatus(bookingId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "merchant"] });
      toast.success(variables.payload.status === "ACCEPTED" ? "Booking accepted." : "Booking rejected.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}