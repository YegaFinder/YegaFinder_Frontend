import { OrderSummary } from "@/features/booking/components/OrderSummary";

// UI shell only — no real payment provider wired yet (needs backend +
// provider decision, per Sprint 6 handoff). This lets the flow feel
// complete end-to-end for demo purposes.
export default function CheckoutPage() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>

      {/* Placeholder data until this is wired to real selection state
          carried over from ServiceSelector/DateTimePicker */}
      <OrderSummary
        businessName="Selected business"
        service={{ id: "placeholder", name: "Selected service" }}
      />

      <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
        Payment integration coming soon
      </div>

      <button
        type="button"
        disabled
        className="w-full rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm opacity-50 cursor-not-allowed"
      >
        Confirm and pay
      </button>
    </main>
  );
}
