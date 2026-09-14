export type { Booking, BookingStatus } from "@/types/business.types";

export interface CreateBookingRequest {
  businessId: string;
  appointmentTime: string; // ISO 8601, future only
  notes?: string;
}

export interface UpdateBookingStatusRequest {
  status: "ACCEPTED" | "REJECTED";
}