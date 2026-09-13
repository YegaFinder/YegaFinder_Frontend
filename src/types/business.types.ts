export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  // FIXED: backend actually sends "Customer" | "Merchant" | "Moderator" | "Admin"
  // (see UserRole enum, users/enums/user-role.enum.ts). This previously used
  // ALL-CAPS values that never match a real API response — any `role === "MERCHANT"`
  // check against data from this type was silently always false.
  role: "Customer" | "Merchant" | "Moderator" | "Admin";
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface BusinessCategory {
  id: string;
  name: string;
  description: string | null;
  subCategories?: BusinessCategory[];
  parentCategory?: BusinessCategory | null;
}

export type Category = BusinessCategory;

export interface BusinessHoursItem {
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
  is24Hours: boolean;
  breakStartTime: string | null;
  breakEndTime: string | null;
}

// FIXED: backend's servicesOffered is an array of objects (Business entity,
// services_offered jsonb column), never plain strings.
export interface BusinessService {
  id: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
}

export interface Listing {
  id: string;
  businessName: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  businessAddress: string | null;
  latitude: number | null;
  longitude: number | null;
  websiteUrl: string | null;
  socialMedia: Record<string, string>;
  // NOTE: always [] in practice right now — the backend accepts
  // businessCategories on create/update but never persists them
  // (confirmed in profiles.service.ts). Not a frontend bug, don't
  // "fix" this by changing the shape — the shape is correct, the
  // backend just never fills it in yet.
  businessCategories: BusinessCategory[];
  servicesOffered: BusinessService[]; // FIXED: was string[]
  businessHours: BusinessHoursItem[];
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  isProfileComplete: boolean;
  isPublic: boolean;
  // FIXED: lowercase — matches Business entity's verificationStatus column exactly.
  verificationStatus: "pending" | "verified" | "rejected";
  // FIXED: dropped "DRAFT" — the backend's ListingStatus enum only has
  // these three values, a listing is never in a "draft" state server-side.
  listingStatus: "PENDING" | "APPROVED" | "REJECTED";
  listingSubmittedAt: string | null;
  listingReviewedAt: string | null;
  listingRejectionReason: string | null;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface NearbyListing extends Listing {
  distanceKm: number;
}

// This matches /listings, /listings/search, /listings/nearby exactly:
// { listings: [...], meta: { total, page, limit } } — no `success` wrapper
// at this level (it's one level up, wrapping this whole object).
export interface PaginatedListingsResponse<T = Listing> {
  listings: T[];
  meta: { total: number; page: number; limit: number };
}

export interface Review {
  id: string;
  userId: string;
  businessId: string;
  rating: number;
  comment: string | null;
  verifiedBookingId: string | null;
  // Present on GET /businesses/:businessId/reviews (the User relation is
  // `eager: true` on BusinessReview, so TypeORM includes it automatically
  // on every find()). NOT reliably present on the response to POST (the
  // create endpoint returns the just-saved row without reloading relations) —
  // don't assume `user` exists right after submitting a review, only after
  // refetching the list.
  user: User;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}