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
  distanceKm?: number;
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

// Matches the confirmed live implementation (BusinessMessagingController,
// `messages` table) per CHAT_MESSAGES_FRONTEND_GUIDE.md §2.3 — NOT the dead
// ChatController/chat_messages one. updatedAt/deletedAt are always present
// on the wire even though nothing reads them yet (soft-delete support).
export interface Message {
  id: string;
  businessId: string;
  senderId: string;
  senderRole: SenderRole;
  text: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// REMOVED: MerchantThread. It modeled GET /messages/merchant/threads, which
// CHAT_MESSAGES_FRONTEND_GUIDE.md §1 confirms is dead code — Express matches
// BusinessMessagingController's GET /:businessId route first, so this
// request actually runs with businessId literally equal to "merchant" and
// never reaches the intended threads handler. There is no working
// backend-provided "threads" shape today. See MerchantThread (client-derived,
// not a wire type) in features/messaging/lib/groupMessagesByCustomer.ts for
// the replacement — a threads view now built entirely from the flat message
// list, not from this endpoint.

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