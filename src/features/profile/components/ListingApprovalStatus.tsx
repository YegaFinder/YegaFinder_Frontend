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

  // FIXED: listingStatus defaults to "PENDING" the moment a profile is
  // created — before it's ever been submitted for review. The old code
  // checked `listingStatus === "PENDING"` first, so a brand-new,
  // never-submitted profile always hit the "pending review" branch below
  // and the Submit button never rendered. listingSubmittedAt is only set
  // by POST /merchant/listing/submit, so its absence is the real signal
  // for "never submitted" — check that BEFORE the PENDING branch.
  if (!profile.listingSubmittedAt) {
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

  // Approved but not (yet) public — e.g. an admin approved it before
  // isPublic flipped, or it was manually unpublished. Fall back to the
  // same "ready to submit again" affordance rather than showing nothing.
  return (
    <div className="flex flex-col gap-2 rounded-[10px] border border-yegna-border bg-yegna-background px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground">Your listing isn&apos;t visible to customers right now.</span>
      <Button size="sm" onClick={onSubmit} disabled={isSubmitting || !profile.isProfileComplete}>
        {isSubmitting ? "Submitting..." : "Submit for review"}
      </Button>
    </div>
  );
}
