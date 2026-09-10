import { CalendarClock } from "lucide-react";

/**
 * STUB — Sprint 4 head start only. Fleshed out in Sprint 5 with real
 * data (merchant-bookings feature: BookingsTable, useMerchantBookings,
 * accept/reject actions) once the Booking API exists.
 * Reachable today at ROUTES.MERCHANT_BOOKINGS ("/dashboard/bookings").
 */
export default function MerchantBookingsPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <CalendarClock className="h-10 w-10 text-muted-foreground" />
      <p className="text-lg text-muted-foreground">Booking management is coming in a later sprint.</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Once customers can book your services, requests and reservations will show up here.
      </p>
    </div>
  );
}
