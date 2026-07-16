import { apiClient } from "@/lib/api-client";
import { getRefreshToken } from "@/lib/auth-storage";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  DevOtpResponse,
  User,
} from "../types/auth.types";

export const authApi = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post("/auth/login", payload);
    return data; // direct, flat response
  },

  register: async (payload: RegisterRequest): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post("/auth/register", payload);
    return { otp: data?.otp };
  },

  verifyOtp: async (payload: VerifyOtpRequest): Promise<void> => {
    await apiClient.post("/auth/verify-otp", payload);
  },

  resendVerification: async (payload: { email: string }): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post("/auth/resend-verification", payload);
    return { otp: data?.otp };
  },

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post("/auth/forgot-password", payload);
    return { otp: data?.otp };
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<void> => {
    await apiClient.post("/auth/reset-password", payload);
  },

  // Changed endpoint to /auth/profile to match the guide's Postman section
  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get("/auth/profile");
    return data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    await apiClient.post("/auth/logout", { refreshToken });
  },

  logoutAll: async (): Promise<void> => {
    await apiClient.post("/auth/logout-all");
  },
};