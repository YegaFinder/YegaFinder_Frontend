import { MerchantBookingsList } from "@/features/booking/components/MerchantBookingsList";

export default function MerchantBookingsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Requests from customers. Accept or reject each one.
        </p>
      </header>
      <MerchantBookingsList />
    </main>
  );
}