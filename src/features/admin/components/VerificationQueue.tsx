"use client";

import { useState } from "react";
import { useVerificationQueue } from "../hooks/useVerificationQueue";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
] as const;

export function VerificationQueue() {
  const { status, setStatus, listings, isLoading, isError, approve, isApproving, reject, isRejecting } =
    useVerificationQueue();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  function handleRejectSubmit(businessId: string) {
    const trimmed = reason.trim();
    if (!trimmed) return;
    reject(businessId, trimmed);
    setRejectingId(null);
    setReason("");
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium",
              status === tab.value
                ? "border-yegna-primary text-yegna-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading listings...</p>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">Could not load listings.</p>
      ) : !listings?.length ? (
        <p className="text-sm text-muted-foreground">No {status.toLowerCase()} listings.</p>
      ) : (
        <ul className="space-y-3">
          {listings.map((business) => (
            <li key={business.id} className="rounded-xl border p-4 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{business.businessName}</p>
                  {business.businessAddress && (
                    <p className="text-xs text-muted-foreground">{business.businessAddress}</p>
                  )}
                  {business.user && (
                    <p className="text-xs text-muted-foreground">
                      Owner: {business.user.firstName} {business.user.lastName} ({business.user.email})
                    </p>
                  )}
                  {business.listingSubmittedAt && (
                    <p className="text-xs text-muted-foreground">
                      Submitted {new Date(business.listingSubmittedAt).toLocaleString()}
                    </p>
                  )}
                  {business.listingStatus === "REJECTED" && business.listingRejectionReason && (
                    <p className="mt-1 text-xs text-red-700">Reason: {business.listingRejectionReason}</p>
                  )}
                </div>

                {business.listingStatus === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRejectingId(rejectingId === business.id ? null : business.id)}
                      disabled={isApproving || isRejecting}
                    >
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => approve(business.id)} disabled={isApproving || isRejecting}>
                      {isApproving ? "Approving..." : "Approve"}
                    </Button>
                  </div>
                )}
              </div>

              {rejectingId === business.id && (
                <div className="flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center">
                  <input
                    autoFocus
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for rejection (shown to the merchant)"
                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setRejectingId(null); setReason(""); }}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRejectSubmit(business.id)}
                      disabled={!reason.trim() || isRejecting}
                    >
                      {isRejecting ? "Rejecting..." : "Confirm reject"}
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}