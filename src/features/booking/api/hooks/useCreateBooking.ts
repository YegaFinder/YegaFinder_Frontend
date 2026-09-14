import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingApi } from "../booking.api";
import { getErrorMessage } from "@/lib/errors";
import type { CreateBookingRequest } from "../../types/booking.types";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingRequest) => bookingApi.createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
      toast.success("Booking requested — you'll be notified when the merchant responds.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}