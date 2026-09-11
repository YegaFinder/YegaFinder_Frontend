import type { ListingService } from "../types/booking.types";

interface OrderSummaryProps {
  businessName: string;
  service: ListingService;
  date?: string;
  time?: string;
}

// Static summary — no real payment provider wired yet (Sprint 6 backend item).
export function OrderSummary({ businessName, service, date, time }: OrderSummaryProps) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <h3 className="font-semibold text-sm">Order summary</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Business</span>
          <span className="font-medium">{businessName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Service</span>
          <span className="font-medium">{service.name}</span>
        </div>
        {date && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{date}</span>
          </div>
        )}
        {time && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium">{time}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-3 flex justify-between text-sm font-semibold">
        <span>Total</span>
        <span>
          {service.price !== undefined
            ? `${service.currency ?? ""} ${service.price}`
            : "Price on request"}
        </span>
      </div>
    </div>
  );
}
