"use client";

import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/form-feedback";
import { useMerchantBookings } from "../hooks/useMerchantBookings";
import { useBookingDecision } from "../hooks/useBookingDecision";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { canDecide, formatBookingTime, toKnownBookingStatus } from "../utils/booking-status";
import type { BookingStatus } from "../types/merchant-booking.types";

const TABS: { label: string; value: BookingStatus | undefined }[] = [
  { label: "New requests", value: "PENDING" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Declined", value: "REJECTED" },
  { label: "All", value: undefined },
];

/**
 * No "Listing" column anymore — GET /bookings/merchant doesn't return
 * which business a booking is against (see merchant-booking.types.ts),
 * and a merchant only has one, so there was never real data for that
 * column to show. No pagination controls either — the real endpoint
 * returns everything at once.
 */
export function BookingsTable() {
  const { bookings, isLoading, isError, statusFilter, setStatusFilter, refetch } = useMerchantBookings();
  const decision = useBookingDecision();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-yegna-navy">Bookings</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setStatusFilter(tab.value)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? "border-yegna-primary bg-yegna-primary text-white"
                : "border-yegna-border bg-background text-muted-foreground hover:border-yegna-primary/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Spinner className="size-5" /> Loading bookings...
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm text-destructive">We couldn&apos;t load your bookings.</p>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-yegna-border py-16 text-center text-sm text-muted-foreground">
          No bookings here yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[20px] border border-yegna-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Requested for</th>
                <th className="px-4 py-3 font-medium">Notes</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const known = toKnownBookingStatus(booking.status);
                const showActions = known ? canDecide(known) : false;
                const isThisRowPending = decision.isPending && decision.variables?.id === booking.id;

                return (
                  <tr key={booking.id} className="border-t border-yegna-border align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium text-yegna-navy">
                        {booking.customer.firstName} {booking.customer.lastName}
                      </div>
                      {booking.customer.phone && (
                        <div className="text-xs text-muted-foreground">{booking.customer.phone}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatBookingTime(booking.appointmentTime)}</td>
                    <td
                      className="max-w-[200px] truncate px-4 py-3 text-muted-foreground"
                      title={booking.notes ?? undefined}
                    >
                      {booking.notes ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <BookingStatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {showActions && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={decision.isPending}
                            onClick={() => decision.mutate({ id: booking.id, decision: "reject" })}
                          >
                            {isThisRowPending && decision.variables?.decision === "reject" ? (
                              <Spinner className="size-3.5" />
                            ) : (
                              <X className="size-3.5" />
                            )}
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            disabled={decision.isPending}
                            onClick={() => decision.mutate({ id: booking.id, decision: "accept" })}
                          >
                            {isThisRowPending && decision.variables?.decision === "accept" ? (
                              <Spinner className="size-3.5" />
                            ) : (
                              <Check className="size-3.5" />
                            )}
                            Accept
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}