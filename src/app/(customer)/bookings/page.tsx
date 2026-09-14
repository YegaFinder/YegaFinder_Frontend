"use client";

import { MyBookingsList } from "@/features/booking/components/MyBookingsList";

export default function BookingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 sm:p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Your bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage your upcoming and past appointments.
        </p>
      </div>

      <section className="rounded-[16px] border border-yegna-border bg-background p-5">
        <MyBookingsList />
      </section>
    </div>
  );
}