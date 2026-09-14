export type Role = "Customer" | "Merchant" | "Moderator" | "Admin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: Role; // exact case: "Customer" | "Merchant" | "Moderator" | "Admin"
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  otp?: string; // only present in TEST_MODE on register
}

export interface LoginRequest { email: string; password: string; }

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: Extract<Role, "Customer" | "Merchant">;
  agreedToTerms: boolean;
}

export interface VerifyOtpRequest { email: string; otp: string; }
export interface ForgotPasswordRequest { email: string; }
export interface ResetPasswordRequest { email: string; otp: string; newPassword: string; }
export interface DevOtpResponse { otp?: string; }