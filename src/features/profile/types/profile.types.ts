// This is the senior's `main` version, with only the customer-specific
// request/response types appended at the bottom.

import type { User } from "@/features/auth/types/auth.types";

export interface BaseProfile {
  id: string;
  user: User;                        // from main – correct
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  bio?: string | null;
  preferredLanguage?: string;
  notificationPreferences: Record<string, boolean>;
  isProfileComplete: boolean;
  loyaltyPoints: number;
  savedAddresses: SavedAddress[];
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
  // customer‑specific fields go here (none yet)
}

export interface MerchantProfile extends BaseProfile {
  // merchant‑specific fields – kept as in main
  businessName: string;
  businessCategory: string;
  verificationStatus: "pending" | "verified" | "rejected";
  // ... other merchant fields from main
}

// ----------------------------
// Appended request types (branch additions)
// ----------------------------

export type UpdateCustomerProfileRequest = {
  dateOfBirth?: string;
  bio?: string;
  preferredLanguage?: string;
  avatarUrl?: string;
};

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