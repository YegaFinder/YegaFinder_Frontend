import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingApi } from "../booking.api";
import { getErrorMessage } from "@/lib/errors";

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => bookingApi.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
      toast.success("Booking cancelled.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}