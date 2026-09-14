import { apiClient } from "@/lib/api-client";
import { getRefreshToken } from "@/lib/auth-storage";
import { unwrapNullableEnvelope, type ApiEnvelope } from "@/lib/api-response";
import type {
  AuthResponse, LoginRequest, RegisterRequest, VerifyOtpRequest,
  ForgotPasswordRequest, ResetPasswordRequest, DevOtpResponse, User,
} from "../types/auth.types";

export const authApi = {
  // §3.1 — Pattern A, data.otp only in TEST_MODE
  register: async (payload: RegisterRequest): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<DevOtpResponse | null>>("/auth/register", payload);
    const unwrapped = unwrapNullableEnvelope<DevOtpResponse>(data.data);
    return { otp: unwrapped?.otp };
  },

  // §3.1 step 2 — issues tokens
  verifyOtp: async (payload: VerifyOtpRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<AuthResponse>>("/auth/verify-otp", payload);
    return data.data;
  },

  resendVerification: async (payload: { email: string }): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<DevOtpResponse | null>>("/auth/resend-verification", payload);
    const unwrapped = unwrapNullableEnvelope<DevOtpResponse>(data.data);
    return { otp: unwrapped?.otp };
  },

  // §3.2 — Pattern A
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<AuthResponse>>("/auth/login", payload);
    return data.data;
  },

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<DevOtpResponse | null>>("/auth/forgot-password", payload);
    const unwrapped = unwrapNullableEnvelope<DevOtpResponse>(data.data);
    return { otp: unwrapped?.otp };
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<void> => {
    await apiClient.post("/auth/reset-password", payload);
  },

  // §3.4
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiEnvelope<User>>("/auth/me");
    return data.data;
  },

  // §3.5
  logout: async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    await apiClient.post("/auth/logout", { refreshToken });
  },

  logoutAll: async (): Promise<void> => {
    await apiClient.post("/auth/logout-all");
  },
};