export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "MERCHANT" | "ADMIN" | "MODERATOR";
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
  businessCategories: BusinessCategory[];
  servicesOffered: string[];
  businessHours: BusinessHoursItem[];
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
  isProfileComplete: boolean;
  isPublic: boolean;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  listingStatus: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
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
  user: User;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
