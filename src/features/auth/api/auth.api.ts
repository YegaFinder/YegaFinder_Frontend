import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from "../types/auth.types";

/**
 * Every auth-related HTTP call, in one place. Both Person A's and
 * Person B's hooks (useRegister, useLogin, etc.) call into these —
 * neither of you should call apiClient.post(...) directly from a
 * component or hook. Keeping the endpoint + payload shape here means
 * there's exactly one place to update if the backend contract changes.
 */
export const authApi = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      payload,
    );
    return data.data;
  },

  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      payload,
    );
    return data.data;
  },

  verifyOtp: async (payload: VerifyOtpRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/verify-otp",
      payload,
    );
    return data.data;
  },

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      "/auth/forgot-password",
      payload,
    );
    return data.data;
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<{ message: string }> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      "/auth/reset-password",
      payload,
    );
    return data.data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
    return data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
};
