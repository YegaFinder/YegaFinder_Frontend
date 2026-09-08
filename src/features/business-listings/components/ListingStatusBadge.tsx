import { cn } from "@/lib/utils";
import type { BusinessListingStatus } from "@/types/business.types";

const STYLES: Record<BusinessListingStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const LABELS: Record<BusinessListingStatus, string> = {
  pending: "Pending review",
  approved: "Live",
  rejected: "Rejected",
};

/**
 * Deliberately separate from profile/VerificationBadge.tsx — that badge is
 * about the merchant's own identity verification ("verified" business
 * account), a different concept from whether one specific listing has
 * been approved for public display.
 */
export function ListingStatusBadge({ status }: { status: BusinessListingStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", STYLES[status])}>
      {LABELS[status]}
    </span>
  );
}