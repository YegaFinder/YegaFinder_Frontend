"use client";

import { FavoritesList } from "@/features/favorites/components/FavoritesList";

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 sm:p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Your favorites</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Places you&apos;ve liked, all in one place.
        </p>
      </div>

      <section className="rounded-[16px] border border-yegna-border bg-background p-5">
        <FavoritesList />
      </section>
    </div>
  );
}
