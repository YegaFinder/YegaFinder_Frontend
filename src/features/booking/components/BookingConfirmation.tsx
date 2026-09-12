import type { ListingService } from "../types/booking.types";

interface BookingConfirmationProps {
  businessName: string;
  service: ListingService;
  date: string;
  time: string;
}

// Static confirmation layout — no real booking submission yet since the
// backend endpoint doesn't exist. This renders once a booking is "placed"
// via local state upstream; swap for real confirmation data once wired.
export function BookingConfirmation({
  businessName,
  service,
  date,
  time,
}: BookingConfirmationProps) {
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-lg border p-6 text-center space-y-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <span className="text-2xl" aria-hidden="true">✓</span>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Booking confirmed</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your booking with {businessName} is set.
        </p>
      </div>

      <div className="rounded-md bg-muted text-left p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Service</span>
          <span className="font-medium">{service.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium">{formattedDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium">{time}</span>
        </div>
        {service.price !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price</span>
            <span className="font-medium">
              {service.currency ?? ""} {service.price}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
