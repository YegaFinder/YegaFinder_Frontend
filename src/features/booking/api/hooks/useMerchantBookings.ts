import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "../booking.api";

export function useMerchantBookings() {
  return useQuery({ queryKey: ["bookings", "merchant"], queryFn: bookingApi.getMerchantBookings });
}