// Base profile interface (shared fields)
export interface BaseProfile {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Customer Profile extensions (Blocked on backend confirmation - using stubs)
export interface CustomerProfile extends BaseProfile {
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  phone: string | null;
}

// Merchant Profile extensions (Blocked on backend confirmation - using stubs)
export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface MerchantProfile extends BaseProfile {
  businessName: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  hours: BusinessHours[];
}
