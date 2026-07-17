import type { User } from "@/features/auth/types/auth.types";

export interface BaseProfile {
  id: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
}


export interface CustomerProfile extends BaseProfile {
  avatarUrl?: string;
  dateOfBirth?: string;
  bio?: string;
  preferredLanguage: string;
  notificationPreferences: Record<string, boolean>;
  savedAddresses: SavedAddress[];
  loyaltyPoints: number;
  isProfileComplete: boolean;
}

export type DayOfWeek =
  | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface BusinessHours {
  id: string;
  merchantProfileId: string;
  dayOfWeek: DayOfWeek;
  openTime?: string;
  closeTime?: string;
  isClosed: boolean;
  is24Hours: boolean;
  breakStartTime?: string;
  breakEndTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessService {
  id: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}

export interface MerchantProfile extends BaseProfile {
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
  socialMedia: SocialMediaLinks;
  businessCategories: string[];
  servicesOffered: BusinessService[];
  businessHours: BusinessHours[];
  isProfileComplete: boolean;

  // Read-only — confirmed NO endpoint modifies any of these four
  // (BACKEND_INTEGRATION_GUIDE.md §5, §10). Never PUT these.
  verificationStatus: "pending" | "verified" | "rejected";
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
}


/**
 * Payload shapes for the two merchant-profile write endpoints.
 * Deliberately restricted to fields that actually exist on
 * CreateMerchantProfileDto / UpdateMerchantProfileDto — the global
 * ValidationPipe has forbidNonWhitelisted:true, so any extra key
 * (e.g. accidentally including verificationStatus) 400s the whole
 * request (BACKEND_INTEGRATION_GUIDE.md §1, §5.8).
 */
export interface UpdateMerchantProfileRequest {
  businessName?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessAddress?: string;
  websiteUrl?: string;
  businessCategories?: string[];
}

/** businessName is the ONLY required field on create (§5.8). */
export type CreateMerchantProfileRequest = UpdateMerchantProfileRequest & { businessName: string };

/**
 * PUT /profiles/merchant/business-hours is a full delete-and-recreate
 * (§5.9) — always send all 7 days, never a partial list.
 */
export interface UpdateBusinessHoursRequest {
  businessHours: Array<{
    dayOfWeek: DayOfWeek;
    isClosed: boolean;
    is24Hours: boolean;
    openTime?: string;
    closeTime?: string;
    breakStartTime?: string;
    breakEndTime?: string;
  }>;
}