"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { MerchantProfile } from "../types/profile.types";

export function ListingApprovalStatus({
  profile,
  onSubmit,
  isSubmitting,
}: {
  profile: MerchantProfile;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  if (profile.listingStatus === "APPROVED" && profile.isPublic) {
    return (
      <div className="flex items-center gap-2 rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
        <CheckCircle2 className="size-4 shrink-0" />
        <span>Your listing is live and visible to customers.</span>
      </div>
    );
  }

  if (profile.listingStatus === "PENDING") {
    return (
      <div className="flex items-center gap-2 rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
        <Clock className="size-4 shrink-0" />
        <span>Your listing is pending review by our team.</span>
      </div>
    );
  }

  if (profile.listingStatus === "REJECTED") {
    return (
      <div className="space-y-2 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        <div className="flex items-center gap-2">
          <XCircle className="size-4 shrink-0" />
          <span className="font-medium">Your listing was rejected.</span>
        </div>
        {profile.listingRejectionReason && (
          <p className="pl-6 text-red-700">Reason: {profile.listingRejectionReason}</p>
        )}
        <div className="pl-6">
          <Button size="sm" onClick={onSubmit} disabled={isSubmitting || !profile.isProfileComplete}>
            {isSubmitting ? "Resubmitting..." : "Fix and resubmit"}
          </Button>
        </div>
      </div>
    );
  }

  // Not yet submitted at all (brand-new profile, listingStatus defaults to
  // PENDING server-side on create — this branch covers a profile that's
  // been created but never explicitly submitted; adjust the condition here
  // if your backend testing shows PENDING-but-never-submitted needs its
  // own distinct state).
  return (
    <div className="flex flex-col gap-2 rounded-[10px] border border-yegna-border bg-yegna-background px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground">
        {profile.isProfileComplete
          ? "Ready to go live — submit your listing for admin review."
          : "Complete your business profile (name, description, logo, address, phone) to submit for review."}
      </span>
      <Button size="sm" onClick={onSubmit} disabled={isSubmitting || !profile.isProfileComplete}>
        {isSubmitting ? "Submitting..." : "Submit for review"}
      </Button>
    </div>
  );
}