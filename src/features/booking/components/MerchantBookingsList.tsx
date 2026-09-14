"use client";

import { useMerchantBookings } from "../api/hooks/useMerchantBookings";
import { useUpdateBookingStatus } from "../api/hooks/useUpdateBookingStatus";
import type { BookingStatus } from "../types/booking.types";
import { Button } from "@/components/ui/button";

const STATUS_STYLES: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

export function MerchantBookingsList() {
  const { data: bookings, isLoading, isError } = useMerchantBookings();
  const { accept, isAccepting, reject, isRejecting } = useUpdateBookingStatus();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading bookings...</p>;
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">Could not load bookings. Try again.</p>;
  }

  if (!bookings?.length) {
    return <p className="text-sm text-muted-foreground">No booking requests yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {bookings.map((booking) => {
        const isPending = booking.status === "PENDING";
        return (
          <li
            key={booking.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3"
          >
            <div>
              <p className="text-sm font-medium">
                {booking.customer?.firstName ?? "Customer"} {booking.customer?.lastName ?? ""}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(booking.appointmentTime).toLocaleString()}
              </p>
              {booking.notes && (
                <p className="text-xs text-muted-foreground mt-0.5 italic">&ldquo;{booking.notes}&rdquo;</p>
              )}
              <span
                className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[booking.status]}`}
              >
                {booking.status}
              </span>
            </div>

            {isPending && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => reject(booking.id)}
                  disabled={isAccepting || isRejecting}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => accept(booking.id)}
                  disabled={isAccepting || isRejecting}
                >
                  Accept
                </Button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}