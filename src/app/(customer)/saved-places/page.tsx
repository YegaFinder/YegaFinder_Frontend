"use client";

import { SavedAddressesList } from "@/features/profile/components/SavedAddressesList";

export default function SavedPlacesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 sm:p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Saved places</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Save addresses you visit often — home, work, or anywhere else — so you can find them
          faster next time.
        </p>
      </div>

      <section className="rounded-[16px] border border-yegna-border bg-background p-5">
        <SavedAddressesList />
      </section>
    </div>
  );
}
