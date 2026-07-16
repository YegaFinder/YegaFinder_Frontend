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