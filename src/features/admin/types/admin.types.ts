export type { Business, Review } from "@/types/business.types";

export interface AdminAnalyticsSummary {
  totalUsers: number;
  totalMerchants: number;
  totalListings: number;
  totalApprovedListings: number;
  totalBookings: number;
  totalReviews: number;
}

export interface RejectListingRequest { reason: string; }