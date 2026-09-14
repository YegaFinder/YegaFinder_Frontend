import type { User } from "@/features/auth/types/auth.types";

export interface BusinessCategory {
  id: string;
  name: string;
  description: string | null;
  subCategories?: BusinessCategory[];
}

export interface ServiceOffered {
  id: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
}

export interface BusinessHours {
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  openTime: string | null;  // "HH:mm"
  closeTime: string | null; // "HH:mm"
  isClosed: boolean;
  is24Hours: boolean;
  breakStartTime: string | null;
  breakEndTime: string | null;
}

export interface GalleryItem {
  id: string;
  businessId: string;
  mediaUrl: string;
  mediaType: string;
  caption?: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  description?: string;
  discountPercentage?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface Business {
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
  taxId?: string;
  averageRating: number;
  totalReviews: number;
  verificationStatus: "pending" | "verified" | "rejected";
  listingStatus: "PENDING" | "APPROVED" | "REJECTED"; // UPPERCASE
  isPublic: boolean;
  isFeatured: boolean;
  isProfileComplete: boolean;
  listingSubmittedAt?: string;
  listingReviewedAt?: string;
  listingRejectionReason?: string;
  user?: User;
  businessCategories?: BusinessCategory[];
  servicesOffered?: ServiceOffered[];
  businessHours?: BusinessHours[];
  galleries?: GalleryItem[];
  promotions?: Promotion[];
  createdAt: string;
  updatedAt: string;
}

export interface NearbyBusiness extends Business {
  distanceKm: number;
}

// Bookings
export type BookingStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

export interface Booking {
  id: string;
  customerId: string;
  businessId: string;
  status: BookingStatus;
  appointmentTime: string;
  notes?: string;
  customer?: Pick<User, "id" | "firstName" | "lastName" | "email" | "phone">;
  business?: Pick<Business, "id" | "businessName" | "logoUrl">;
  createdAt: string;
  updatedAt: string;
}

// Reviews
export interface Review {
  id: string;
  userId: string;
  businessId: string;
  rating: number;
  comment?: string;
  verifiedBookingId?: string;
  user?: Pick<User, "id" | "firstName" | "lastName" | "email">;
  createdAt: string;
}

export interface NewReview {
  rating: number;
  comment: string;
  verifiedBookingId?: string;
}

// Chat / Messages
export type SenderRole = "CUSTOMER" | "MERCHANT";

export interface Message {
  id: string;
  businessId: string;
  senderId: string;
  senderRole: SenderRole;
  text: string;
  createdAt: string;
}

export interface MerchantThread {
  customerId: string;
  customerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// Payments
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface Payment {
  status: PaymentStatus;
  amount: number;
  currency: string;
  txRef: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}