import type { BookingStatus } from "../types/merchant-booking.types";

const KNOWN_STATUSES: readonly BookingStatus[] = ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"];

/**
 * Narrows an arbitrary value to BookingStatus, or null if it's something
 * we don't recognize. Kept even now that the contract is confirmed — a
 * backend deploy that adds a new status, or a typo somewhere, still
 * shouldn't be able to crash this table.
 */
export function toKnownBookingStatus(value: unknown): BookingStatus | null {
  return typeof value === "string" && (KNOWN_STATUSES as readonly string[]).includes(value)
    ? (value as BookingStatus)
    : null;
}

/** Only a "PENDING" booking can be accepted or rejected from the dashboard. */
export function canDecide(status: BookingStatus): boolean {
  return status === "PENDING";
}

/** Formats an ISO timestamp, falling back to the raw string rather than "Invalid Date" if it doesn't parse. */
export function formatBookingTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}