import { cn } from "@/lib/utils";
import { toKnownBookingStatus } from "../utils/booking-status";
import type { BookingStatus } from "../types/merchant-booking.types";

const STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
};

const LABELS: Record<BookingStatus, string> = {
  pending: "New request",
  confirmed: "Accepted",
  rejected: "Declined",
  cancelled: "Cancelled",
  completed: "Completed",
};

/**
 * Takes `unknown` rather than BookingStatus on purpose — every value here
 * ultimately came from an API response we haven't confirmed the exact
 * enum for yet (see merchant-booking.types.ts). If the backend ever sends
 * a status this component doesn't recognize, it shows a neutral "Unknown"
 * pill with the raw value rather than crashing the whole table or
 * rendering nothing.
 */
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