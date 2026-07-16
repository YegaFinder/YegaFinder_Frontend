export type Role = "Customer" | "Merchant" | "Moderator" | "Admin";

export type Role = "Customer" | "Merchant" | "Moderator" | "Admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isVerified: boolean;
  avatarUrl?: string;
  phone?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  role?: Role;
}

// ---------------------------- Request shapes ---------------------------- */

// ... request types (unchanged)

/* ---------------------------- Request shapes ---------------------------- */
/* Kept here (shared) rather than duplicated inside each schema file, so   */
/* both people's Zod schemas can infer from — or be checked against — the  */
/* same contract the API layer expects.                                    */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Extract<Role, "Customer" | "Merchant">; // users self-register as one of these two
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

/**
 * Shape returned by register / resend-verification / forgot-password
 * ONLY when the backend is running with TEST_MODE=true (no SMTP/Resend
 * configured). `otp` is present so the frontend can render it directly
 * instead of the user waiting on an email that isn't being sent. In
 * production (TEST_MODE unset or false) `otp` is always undefined and
 * the UI that reads it should simply render nothing.
 */
export interface DevOtpResponse {
  otp?: string;
}