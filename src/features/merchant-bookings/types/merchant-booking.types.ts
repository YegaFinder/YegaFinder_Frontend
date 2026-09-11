/**
 * The Booking API doesn't exist on the backend yet (it's a Sprint 5 item
 * per the sprint plan), so everything in this file is a best guess at the
 * eventual shape rather than something confirmed against real docs. Kept
 * deliberately small — just what BookingsTable actually needs to render —
 * so there's less to be wrong about once the real contract shows up.
 */

/**
 * "cancelled" is here even though nothing in this feature triggers it yet
 * (only a customer cancelling their own booking would cause it) — it's
 * included now so BookingStatusBadge and the status filter tabs don't need
 * a follow-up change the day cancellation ships on the customer side.
 */
export type BookingStatus = "pending" | "confirmed" | "rejected" | "cancelled" | "completed";

/**
 * A booking as the merchant sees it — one customer's request against one
 * of the merchant's listings. `customerName`/`customerPhone` are flat
 * strings rather than a nested customer object because the merchant only
 * ever needs to *display* who's asking, never to look them up or link to
 * a customer profile — if that changes, this should become a proper
 * `customer: { id, name, phone }` object instead of flattening it out again.
 */
export interface MerchantBooking {
  id: string;
  listingId: string;
  listingTitle: string;
  customerName: string;
  customerPhone?: string;
  /** ISO timestamp for the requested appointment slot, not when the booking was created. */
  requestedAt: string;
  status: BookingStatus;
  /** Optional note the customer left when booking (e.g. "window seat if possible"). */
  note?: string;
  createdAt: string;
}

export interface MyBookingsQuery {
  page?: number;
  pageSize?: number;
  /** Omit to fetch every status; the UI's tabs each pass one specific status through here. */
  status?: BookingStatus;
}

/** The only two transitions a merchant can make from the dashboard — accepting or declining a pending request. */
export type BookingDecision = "confirmed" | "rejected";