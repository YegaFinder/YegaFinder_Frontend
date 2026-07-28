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
  // Can be absent (null/undefined) on the backend for a profile that has
  // never had a preference explicitly saved yet — do not assume present.
  notificationPreferences?: Record<string, boolean> | null;
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
  taxId?: string;
  deliveryRadius?: number;
  serviceAreas?: string[];
  socialMedia: SocialMediaLinks;
  businessCategories: string[];
  servicesOffered: BusinessService[];
  businessHours: BusinessHours[];
  isProfileComplete: boolean;

  // Read-only — confirmed NO endpoint modifies any of these four
  // (BACKEND_API_GUIDE.md §5, §10). Never PUT these.
  verificationStatus: "pending" | "verified" | "rejected";
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;
}

/**
 * Payload shapes for the two merchant-profile write endpoints.
 * Deliberately restricted to fields that actually exist on
 * CreateBusinessDto / UpdateBusinessDto — the global ValidationPipe has
 * forbidNonWhitelisted:true, so any extra key 400s the whole request
 * (BACKEND_API_GUIDE.md §1.5, §5.1).
 */
export interface UpdateMerchantProfileRequest {
  businessName?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessAddress?: string;
  latitude?: number;
  longitude?: number;
  websiteUrl?: string;
  taxId?: string;
  deliveryRadius?: number;
  serviceAreas?: string[];
  socialMedia?: SocialMediaLinks;
  /**
   * ⚠️ Accepted by the DTO's validation but SILENTLY DISCARDED server-side
   * (BACKEND_API_GUIDE.md §5.1 — destructured out and never used in
   * profiles.service.ts). Sending it will not error, but it will never
   * persist or come back on GET. Left here so the UI can keep sending it
   * without a 400, and so this starts working automatically the moment
   * the backend fixes it — don't spend time debugging your own payload
   * for this field, it's a confirmed backend no-op.
   */
  businessCategories?: string[];
  servicesOffered?: BusinessService[];
}

/** businessName is the ONLY required field on create (§5.1). */
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

// ========================================================
// Customer-specific request types (appended)
// ========================================================

/**
 * Matches CreateCustomerProfileDto / UpdateCustomerProfileDto exactly
 * (identical shape per the integration guide §5.7). PUT is a partial
 * merge server-side (Object.assign-style) at the TOP LEVEL only — so
 * sending `savedAddresses` or `notificationPreferences` REPLACES the
 * whole array/object, it does not merge item-by-item. Callers that only
 * want to change one address or one notification key must send back the
 * full, already-mutated array/object.
 */
export type UpdateCustomerProfileRequest = {
  dateOfBirth?: string;
  bio?: string;
  preferredLanguage?: string;
  avatarUrl?: string;
  notificationPreferences?: Record<string, boolean>;
  savedAddresses?: SavedAddress[];
};

/** POST and PUT share the same DTO shape — nothing is required to create. */
export type CreateCustomerProfileRequest = UpdateCustomerProfileRequest;

export type UpdateNotificationPreferencesRequest = {
  notificationPreferences: Record<string, boolean>;
};

export type CreateSavedAddressRequest = {
  label: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type UpdateSavedAddressRequest = CreateSavedAddressRequest & { id: string };