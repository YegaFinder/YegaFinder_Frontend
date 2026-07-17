export type Role = "Customer" | "Merchant" | "Moderator" | "Admin";

/** Matches UserResponseDto exactly (BACKEND_INTEGRATION_GUIDE.md §5) —
 * every field here except `phone` is non-optional on the real response. */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: Role;
  isVerified: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: Extract<Role, "Customer" | "Merchant">;
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

export interface DevOtpResponse {
  otp?: string;
}