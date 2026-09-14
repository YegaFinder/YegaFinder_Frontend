import { apiClient } from "@/lib/api-client";
import type { Booking, CreateBookingRequest, UpdateBookingStatusRequest } from "../types/booking.types";

export const bookingApi = {
  // §6.1 — Pattern C
  createBooking: async (payload: CreateBookingRequest): Promise<Booking> => {
    const { data } = await apiClient.post<Booking>("/bookings", payload);
    return data;
  },

  // §6.2 — Pattern C (customer's own bookings)
  getMyBookings: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get<Booking[]>("/bookings");
    return data;
  },

  // §6.3 — Pattern C (merchant only)
  getMerchantBookings: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get<Booking[]>("/bookings/merchant");
    return data;
  },

  // §6.4 — merchant accepts/rejects
  updateBookingStatus: async (bookingId: string, payload: UpdateBookingStatusRequest): Promise<Booking> => {
    const { data } = await apiClient.patch<Booking>(`/bookings/${bookingId}/status`, payload);
    return data;
  },

  // §6.5 — customer cancels
  cancelBooking: async (bookingId: string): Promise<Booking> => {
    const { data } = await apiClient.delete<Booking>(`/bookings/${bookingId}`);
    return data;
  },
};