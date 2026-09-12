import { cn } from "@/lib/utils";
import { toKnownBookingStatus } from "../utils/booking-status";
import type { BookingStatus } from "../types/merchant-booking.types";

const STYLES: Record<BookingStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  ACCEPTED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
};

const LABELS: Record<BookingStatus, string> = {
  PENDING: "New request",
  ACCEPTED: "Accepted",
  REJECTED: "Declined",
  CANCELLED: "Cancelled",
};

/** Takes `unknown` rather than BookingStatus — the same defensive shape as before, kept even with a confirmed contract. */
export function BookingStatusBadge({ status }: { status: unknown }) {
  const known = toKnownBookingStatus(status);

  if (!known) {
    return (
      <span
        className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500"
        title={typeof status === "string" ? status : undefined}
      >
        Unknown
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", STYLES[known])}>
      {LABELS[known]}
    </span>
  );
}