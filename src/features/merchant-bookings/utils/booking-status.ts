import type { BookingStatus } from "../types/merchant-booking.types";

const KNOWN_STATUSES: readonly BookingStatus[] = [
  "pending",
  "confirmed",
  "rejected",
  "cancelled",
  "completed",
];

/**
 * Narrows an arbitrary string to BookingStatus, or null if it's something
 * we don't recognize.
 *
 * WHY THIS EXISTS: the Booking API is unconfirmed (see merchant-booking.types.ts),
 * so there's a real chance the backend eventually ships a status value we
 * didn't anticipate — a typo'd enum, a new "no_show" state added later, etc.
 * Every place that reads `booking.status` should go through this first
 * rather than trusting it blindly, so a surprise value degrades to "shown
 * as unknown, filterable, doesn't crash the table" instead of silently
 * breaking the status badge or the accept/reject buttons.
 */
export function toKnownBookingStatus(value: unknown): BookingStatus | null {
  return typeof value === "string" && (KNOWN_STATUSES as readonly string[]).includes(value)
    ? (value as BookingStatus)
    : null;
}

/** Only a "pending" booking can be accepted or rejected from the dashboard. */
export function canDecide(status: BookingStatus): boolean {
  return status === "pending";
}

/**
 * Formats an ISO timestamp for display, falling back to the raw string
 * instead of throwing or showing "Invalid Date" if the backend ever sends
 * something Date can't parse — a malformed timestamp shouldn't take down
 * the whole row it's in.
 */
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