"use client";

import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/form-feedback";
import { ROUTES } from "@/constants/routes";
import { useMyListings } from "../hooks/useMyListings";
import { ListingStatusBadge } from "./ListingStatusBadge";

export function ListingsTable() {
  const { listings, meta, isLoading, isError, page, setPage } = useMyListings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
        <Spinner className="size-5" /> Loading your listings...
      </div>
    );
  }

  if (isError) {
    return <p className="py-16 text-center text-sm text-destructive">We couldn&apos;t load your listings.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-yegna-navy">My listings</h1>
        <Button asChild size="sm">
          <Link href={`${ROUTES.MERCHANT_LISTINGS}/new`}>
            <Plus className="size-4" /> New listing
          </Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-yegna-border py-16 text-center text-sm text-muted-foreground">
          You haven&apos;t created any listings yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[20px] border border-yegna-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} className="border-t border-yegna-border">
                  <td className="px-4 py-3 font-medium text-yegna-navy">{listing.name}</td>

                  <td className="px-4 py-3 text-muted-foreground">{listing.category?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <ListingStatusBadge status={listing.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`${ROUTES.MERCHANT_LISTINGS}/${listing.id}/edit`}>
                        <Pencil className="size-3.5" /> Edit
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2 text-sm">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}