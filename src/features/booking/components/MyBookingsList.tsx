"use client";

import { useMyBookings } from "../api/hooks/useMyBookings";
import { useCancelBooking } from "../api/hooks/useCancelBooking";
import type { BookingStatus } from "../types/booking.types";

const STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

export function MyBookingsList() {
  const { data: bookings, isLoading } = useMyBookings();
  const cancelBooking = useCancelBooking();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading your bookings...</p>;
  }

  if (!bookings?.length) {
    return <p className="text-sm text-muted-foreground">You have no bookings yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {bookings.map((booking) => {
        const canCancel = booking.status === "PENDING" || booking.status === "ACCEPTED";
        return (
          <li
            key={booking.id}
            className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium">
                {booking.business?.businessName ?? "Business"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(booking.appointmentTime).toLocaleString()}
              </p>
              <span
                className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[booking.status]}`}
              >
                {booking.status}
              </span>
            </div>
            {canCancel && (
              <button
                onClick={() => cancelBooking.mutate(booking.id)}
                disabled={cancelBooking.isPending}
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}