import { apiClient } from "@/lib/api-client";
import type { MerchantBooking, BookingDecision } from "../types/merchant-booking.types";

/**
 * Confirmed against yegnafinder_api_schema_reference.md §6 and
 * frontend_api_reference.md §3.4–3.6 — the real, documented contract.
 *
 * IMPORTANT: neither doc shows these endpoints wrapped in the
 * {success, data, message, timestamp} envelope other parts of this app
 * assume (ApiEnvelope) — every example response is the bare object or
 * array directly. Built against that literal reading. If your backend
 * actually wraps everything (some setups do this via a global
 * interceptor even when docs show raw examples), these two functions are
 * the only place that needs to change — just destructure `.data.data`
 * instead of `.data`. Worth a quick real API check before trusting
 * either reading blindly.
 */
export const merchantBookingsApi = {
  /** Backend: GET /bookings/merchant — plain array, no pagination support documented. */
  getMerchantBookings: async (): Promise<MerchantBooking[]> => {
    const { data } = await apiClient.get<MerchantBooking[]>("/bookings/merchant");
    return data;
  },

  /** Backend: PATCH /bookings/merchant/:id/accept or PATCH /bookings/merchant/:id/reject — no request body. */
  decideBooking: async (id: string, decision: BookingDecision): Promise<MerchantBooking> => {
    const { data } = await apiClient.patch<MerchantBooking>(`/bookings/merchant/${id}/${decision}`);
    return data;
  },
};