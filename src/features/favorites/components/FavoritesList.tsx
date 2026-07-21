"use client";

import { Heart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/form-feedback";
import { useFavorites } from "../hooks/useFavorites";

export function FavoritesList() {
  const { favorites, isLoading, isError, endpointNotBuiltYet, removeFavorite, isRemoving } =
    useFavorites();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading favorites…</p>;
  }

  // The backend favorites module doesn't exist yet (backend review
  // action item #1) — show a friendly placeholder instead of an error
  // banner until it ships.
  if (endpointNotBuiltYet) {
    return (
      <div className="rounded-[14px] border border-dashed border-yegna-border bg-yegna-background px-4 py-6 text-center">
        <Heart className="mx-auto mb-2 size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Favorites is coming soon — the backend for this is still being built.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        We couldn&apos;t load your favorites. Please try again.
      </p>
    );
  }

  if (favorites.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">You haven&apos;t favorited any places yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {favorites.map((favorite) => (
        <div
          key={favorite.id}
          className="flex items-center justify-between gap-4 rounded-[14px] border border-yegna-border bg-yegna-background px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <Heart className="size-4 shrink-0 fill-yegna-primary text-yegna-primary" />
            <p className="text-sm font-medium text-foreground">
              {favorite.businessName ?? `Business ${favorite.businessId.slice(0, 8)}`}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove ${favorite.businessName ?? "favorite"}`}
            disabled={isRemoving}
            onClick={() => removeFavorite(favorite.businessId)}
          >
            {isRemoving ? <Spinner className="size-4" /> : <Trash2 className="size-4" />}
          </Button>
        </div>
      ))}
    </div>
  );
}
