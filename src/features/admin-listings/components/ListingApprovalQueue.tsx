"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/form-feedback";
import { useAuthStore } from "@/store/auth-store";
import { useAdminListingsQueue } from "../hooks/useAdminListingsQueue";
import type { ListingApprovalStatus } from "../types/admin-listing.types";

const STATUS_TABS: ListingApprovalStatus[] = ["pending", "approved", "rejected"];

export function ListingApprovalQueue() {
  const user = useAuthStore((s) => s.user);
  const { listings, status, setStatus, isLoading, isError, approve, approvingId, reject, rejectingId } =
    useAdminListingsQueue();

  // Client-side gate only - the real authorization boundary is the
  // backend's @Roles(Admin, Moderator) guard. This just avoids flashing
  // the queue at a Customer/Merchant before their first API call 401s.
  const canModerate = user?.role === "Admin" || user?.role === "Moderator";

  if (!canModerate) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        You don&apos;t have access to the listing approval queue.
      </p>
    );
  }

  const handleReject = (id: string) => {
    const reason = window.prompt("Reason for rejecting this listing:");
    if (!reason || !reason.trim()) return;
    reject({ id, reason: reason.trim() });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-yegna-navy">Listing approval queue</h1>
        <div className="flex gap-2">
          {STATUS_TABS.map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={status === tab ? "default" : "outline"}
              onClick={() => setStatus(tab)}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Spinner className="size-5" /> Loading listings...
        </div>
      ) : isError ? (
        <p className="py-16 text-center text-sm text-destructive">
          We couldn&apos;t load the listing queue.
        </p>
      ) : listings.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-yegna-border py-16 text-center text-sm text-muted-foreground">
          No {status} listings.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[20px] border border-yegna-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Categories</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} className="border-t border-yegna-border">
                  <td className="px-4 py-3 font-medium text-yegna-navy">{listing.businessName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {listing.businessCategories?.length
                      ? listing.businessCategories.map((c) => c.name).join(", ")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {status === "rejected"
                      ? (listing.listingRejectionReason ?? "No reason recorded")
                      : listing.listingSubmittedAt
                        ? new Date(listing.listingSubmittedAt).toLocaleDateString()
                        : "-"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          disabled={approvingId === listing.id || rejectingId === listing.id}
                          onClick={() => approve(listing.id)}
                        >
                          {approvingId === listing.id ? "Approving..." : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={approvingId === listing.id || rejectingId === listing.id}
                          onClick={() => handleReject(listing.id)}
                        >
                          {rejectingId === listing.id ? "Rejecting..." : "Reject"}
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}