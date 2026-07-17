import { apiClient } from "@/lib/api-client";
import { getRefreshToken } from "@/lib/auth-storage";
import { unwrapNullableEnvelope, type ApiEnvelope } from "@/lib/api-response";
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
    const { data } = await apiClient.post<ApiEnvelope<AuthResponse>>("/auth/login", payload);
    return data.data;
  },

  /** Affected by the §3 quirk when TEST_MODE=false — unwrap defensively. */
  register: async (payload: RegisterRequest): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<DevOtpResponse | null>>("/auth/register", payload);
    const unwrapped = unwrapNullableEnvelope<DevOtpResponse>(data.data);
    return { otp: unwrapped?.otp };
  },

  /** `data` is ALWAYS null here (§6.8) — nothing to unwrap or return. */
  verifyOtp: async (payload: VerifyOtpRequest): Promise<void> => {
    await apiClient.post("/auth/verify-otp", payload);
  },

  resendVerification: async (payload: { email: string }): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<DevOtpResponse | null>>("/auth/resend-verification", payload);
    const unwrapped = unwrapNullableEnvelope<DevOtpResponse>(data.data);
    return { otp: unwrapped?.otp };
  },

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<DevOtpResponse | null>>("/auth/forgot-password", payload);
    const unwrapped = unwrapNullableEnvelope<DevOtpResponse>(data.data);
    return { otp: unwrapped?.otp };
  },

  /** `data` is ALWAYS null here (§6.11) — nothing to unwrap or return. */
  resetPassword: async (payload: ResetPasswordRequest): Promise<void> => {
    await apiClient.post("/auth/reset-password", payload);
  },

  /** Confirmed `/auth/me` (not `/auth/profile`) by BACKEND_INTEGRATION_GUIDE.md §6.4. */
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiEnvelope<User>>("/auth/me");
    return data.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    await apiClient.post("/auth/logout", { refreshToken });
  },

  logoutAll: async (): Promise<void> => {
    await apiClient.post("/auth/logout-all");
  },
};