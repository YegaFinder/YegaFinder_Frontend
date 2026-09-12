/**
 * Reconciled against the real backend contract:
 * yegnafinder_api_schema_reference.md §6, frontend_api_reference.md §3.
 * Replaces the earlier version built before this contract existed —
 * that version guessed wrong on nearly every field name and the status enum.
 */

/** Matches the backend exactly, including casing — no "completed" status exists in the real API. */
export type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

/**
 * GET /bookings/merchant loads `customer` but explicitly NOT `business`
 * (see the relations table in the schema reference, §6) — the backend
 * doesn't tell a merchant which listing a booking is against, because a
 * merchant only ever has ONE business (merchant management is the
 * singular /merchant/profile, not a /merchant/listings collection — see
 * the handoff notes for what this means for Sprint 3). There is therefore
 * no `listingTitle` to show here; this booking IS against "your
 * business," full stop, so the UI doesn't need a "which listing" column.
 */
export interface MerchantBooking {
  id: string;
  customerId: string;
  businessId: string;
  /** ISO timestamp for the requested appointment slot. */
  appointmentTime: string;
  notes: string | null;
  status: BookingStatus;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

/** Matches the two real endpoints exactly — .../accept and .../reject — not one generic "set status" call with a body. */
export type BookingDecision = "accept" | "reject";

/** What each decision actually results in, once the backend confirms it — used for the optimistic update. */
export const DECISION_RESULT_STATUS: Record<BookingDecision, BookingStatus> = {
  accept: "ACCEPTED",
  reject: "REJECTED",
};