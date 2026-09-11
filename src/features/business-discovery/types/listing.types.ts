// Real backend contract, confirmed by reading yegnafinder-backend's
// src/profiles/controllers/public-listings.controller.ts and
// business-response.dto.ts directly — not guessed from a doc this time.
// List and detail return the SAME shape (no separate slim/full split).

export interface ListingCategory {
  id: string;
  name: string;
  description?: string;
}

export interface ListingService {
  id: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
}

// Backend types this as Array<any> too — shape genuinely not defined yet.
export type ListingHourEntry = unknown;

export interface Listing {
  id: string;
  businessName: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessAddress?: string;
  latitude?: number;
  longitude?: number;
  websiteUrl?: string;
  businessCategories: ListingCategory[];
  servicesOffered: ListingService[];
  businessHours: ListingHourEntry[];
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  verificationStatus: string;
}
