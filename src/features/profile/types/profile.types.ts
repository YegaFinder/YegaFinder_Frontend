export interface BaseProfile {
  id: string;
  userId: string;
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
  avatarUrl?: string | null;
  dateOfBirth?: string | null; // ISO date string
  bio?: string | null;
  preferredLanguage: string; // default "en"
  notificationPreferences: Record<string, boolean>;
  savedAddresses: SavedAddress[];
  loyaltyPoints: number;
  isProfileComplete: boolean;
}

/* ============================ Merchant Profile ============================ */

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface BusinessHours {
  id: string;
  dayOfWeek: DayOfWeek;
  openTime?: string | null; // "HH:mm", 24-hour
  closeTime?: string | null;
  isClosed: boolean;
  is24Hours: boolean;
  breakStartTime?: string | null;
  breakEndTime?: string | null;
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

export interface VerificationDocument {
  type: string;
  url: string;
  uploadedAt: string;
}

export interface MerchantProfile extends BaseProfile {
  businessName: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;

  businessAddress?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  websiteUrl?: string | null;
  socialMedia: SocialMediaLinks;
  businessCategories: string[];
  servicesOffered: BusinessService[];
  verificationStatus: "pending" | "verified" | "rejected";
  verificationDocuments: VerificationDocument[];
  averageRating: number;
  totalReviews: number;
  isFeatured: boolean;

  businessHours: BusinessHours[];
  isProfileComplete: boolean;
}

/* ---------------------------- Request shapes ---------------------------- */
/* Kept here (shared), same convention as auth.types.ts, so both the Zod   */
/* schemas and the API layer infer from — or are checked against — the     */
/* same contract. Sprint 2 (Customer). Merchant request types land         */
/* alongside the merchant profile feature, later.                          */

/**
 * PATCH /profile/me body. Only customer-editable fields — name/email/phone
 * live on `User` (features/auth/types/auth.types.ts) and are not part of
 * this contract; there's currently no confirmed endpoint for editing them,
 * so the profile form intentionally does not attempt to submit them here.
 */
export interface UpdateCustomerProfileRequest {
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  bio?: string | null;
  preferredLanguage?: string;
}

/**
 * PATCH /profile/me/notifications body. `notificationPreferences` on
 * CustomerProfile is a loose Record<string, boolean> (backend hasn't
 * published a fixed key list), so this is a partial map of whichever keys
 * are being changed rather than a fixed set of named booleans.
 */
export type UpdateNotificationPreferencesRequest = Record<string, boolean>;

/**
 * POST /profile/addresses body. NOTE: `latitude`/`longitude` are required,
 * non-null numbers on the `SavedAddress` response type, but there is no
 * map/geocoding UI yet to obtain real coordinates from a typed address —
 * see SavedAddressesList.tsx's docblock. Until that's resolved, these are
 * sent as 0 placeholders and should be treated as unconfirmed.
 */
export interface CreateSavedAddressRequest {
  label: string;
  address: string;
  latitude: number;
  longitude: number;
}

export type UpdateSavedAddressRequest = Partial<CreateSavedAddressRequest>;
