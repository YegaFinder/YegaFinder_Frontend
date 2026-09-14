"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useInitiatePayment } from "@/features/payments/api/hooks/useInitiatePayment";
import { useVerifyPayment } from "@/features/payments/api/hooks/useVerifyPayment";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const txRef = searchParams.get("txRef"); // present on return-from-Chapa redirect

  const { mutate: initiate, isPending } = useInitiatePayment();
  const { data: payment } = useVerifyPayment(txRef, { pollWhilePending: true });

  if (payment?.status === "PAID" && bookingId) {
    router.push(`/bookings/${bookingId}`);
  }

  return (
    <main className="container mx-auto px-4 py-6 max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Complete Booking Payment</h1>

      {payment && (
        <div className="rounded-lg border p-4 text-sm">
          Status: <strong>{payment.status}</strong> — {payment.amount} {payment.currency}
        </div>
      )}

      {!txRef && (
        <button
          type="button"
          disabled={!bookingId || isPending}
          onClick={() => bookingId && initiate({ bookingId })}
          className="w-full rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm disabled:opacity-50"
        >
          {isPending ? "Redirecting…" : "Pay with Chapa"}
        </button>
      )}
    </main>
  );
}