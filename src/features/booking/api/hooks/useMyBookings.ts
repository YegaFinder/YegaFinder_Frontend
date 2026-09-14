import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "../booking.api";

export function useMyBookings() {
  return useQuery({ queryKey: ["bookings", "mine"], queryFn: bookingApi.getMyBookings });
}