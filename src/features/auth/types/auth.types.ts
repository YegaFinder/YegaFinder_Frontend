/**
 * The four roles defined in the SRS (section 3.1). Every role-based
 * check in the app — middleware, UI conditionals, API calls — should
 * compare against this type, never a raw string, so a typo is caught
 * by TypeScript instead of silently failing at runtime.
 */
export type Role = "Customer" | "Merchant" | "Moderator" | "Admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isVerified: boolean;
  avatarUrl?: string;
}

/** What the backend returns on successful login or registration. */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

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
