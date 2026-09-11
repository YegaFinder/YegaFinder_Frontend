import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/lib/api-response";
import type { PaginatedResponse } from "@/types/api.types";
import type { MerchantBooking, MyBookingsQuery, BookingDecision } from "../types/merchant-booking.types";

/**
 * UNCONFIRMED endpoints — the Booking API is Sprint 5 backend work that
 * hasn't landed yet. Paths below follow the same /merchant/* convention
 * business-listings already uses, since that's the closest confirmed
 * precedent, but confirm all three with backend before relying on them.
 */
export const merchantBookingsApi = {
  /** Backend: GET /merchant/bookings?page=&pageSize=&status= */
  getMyBookings: async (query: MyBookingsQuery = {}): Promise<PaginatedResponse<MerchantBooking>> => {
    const { data } = await apiClient.get<PaginatedResponse<MerchantBooking>>("/merchant/bookings", {
      params: query,
    });
    return data;
  },

  /**
   * Backend: PATCH /merchant/bookings/:id/status
   * Deliberately a narrow "decide" endpoint (confirmed/rejected only)
   * rather than a generic status setter — a merchant should never be able
   * to set a booking to e.g. "completed" or "cancelled" from this screen,
   * those transitions belong elsewhere (post-appointment flow, customer
   * cancellation) and shouldn't share a code path with accept/reject.
   */
  decideBooking: async (id: string, decision: BookingDecision): Promise<MerchantBooking> => {
    const { data } = await apiClient.patch<ApiEnvelope<MerchantBooking>>(`/merchant/bookings/${id}/status`, {
      status: decision,
    });
    return data.data;
  },
};