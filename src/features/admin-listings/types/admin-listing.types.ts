import type { Listing } from "@/features/business-discovery/types/listing.types";

export type ListingApprovalStatus = "pending" | "approved" | "rejected";

// Fields the admin BusinessResponseDto includes (confirmed against
// business-response.dto.ts) that the customer-facing Listing type
// omits, since the public listing page never needed them.
export interface AdminListing extends Listing {
  listingStatus: string;
  isPublic: boolean;
  listingSubmittedAt?: string;
  listingReviewedAt?: string;
  listingRejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RejectListingPayload {
  reason: string;
}