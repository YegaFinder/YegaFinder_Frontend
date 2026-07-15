import { apiClient } from "@/lib/api-client";
import { getRefreshToken } from "@/lib/auth-storage";
import type { ApiResponse } from "@/types/api.types";
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

/**
 * Every auth-related HTTP call, in one place. Hooks (useRegister,
 * useLogin, useOtp, ...) call into these — components should never call
 * apiClient.post(...) directly. One place to update if the backend
 * contract changes.
 *
 * IMPORTANT — response shapes actually confirmed against the backend
 * source (auth.controller.ts):
 *   - register     -> data: null   (no tokens; OTP is emailed, not returned to a logged-in session)
 *   - verifyOtp    -> data: null   (does NOT log the user in — redirect to /login after success)
 *   - login/google -> data: { user, accessToken, refreshToken }
 *   - forgotPassword/requestPasswordReset -> data: { message } (nested, not top-level)
 *   - resetPassword -> data: null
 *   - logout/logoutAll -> data: null
 *
 * `DevOtpResponse` (`{ otp? }`) is layered on top of the real contract
 * for local/staging use ONLY — see auth.types.ts's docblock. If your
 * backend build doesn't support TEST_MODE, `otp` will simply always be
 * undefined here, which every caller already treats as the no-op case.
 */
export const authApi = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      payload,
    );
    // login always populates `data` on a 200 — ApiResponse<T>.data is
    // typed optional only because some endpoints (register, verify-otp)
    // genuinely return null.
    return data.data!;
  },

  register: async (payload: RegisterRequest): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post<ApiResponse<DevOtpResponse | null>>(
      "/auth/register",
      payload,
    );
    return data.data ?? {};
  },

  verifyOtp: async (payload: VerifyOtpRequest): Promise<void> => {
    await apiClient.post<ApiResponse<null>>("/auth/verify-otp", payload);
  },

  /**
   * NOTE: not in the original backend contract description — confirm
   * the real path with the backend team before relying on this. Named
   * to match the "resend code" UX in OtpForm; adjust if the actual
   * route differs (e.g. it may just be calling /auth/register again,
   * or a dedicated /auth/resend-verification route).
   */
  resendVerification: async (payload: { email: string }): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post<ApiResponse<DevOtpResponse | null>>(
      "/auth/resend-verification",
      payload,
    );
    return data.data ?? {};
  },

  forgotPassword: async (payload: ForgotPasswordRequest): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post<ApiResponse<{ message: string } & DevOtpResponse>>(
      "/auth/forgot-password",
      payload,
    );
    return data.data ?? {};
  },

  resetPassword: async (payload: ResetPasswordRequest): Promise<void> => {
    await apiClient.post<ApiResponse<null>>("/auth/reset-password", payload);
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
    return data.data!;
  },

  /** Requires the refresh token in the body — the backend's RefreshTokenDto. */
  logout: async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    await apiClient.post<ApiResponse<null>>("/auth/logout", { refreshToken });
  },

  logoutAll: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>("/auth/logout-all");
  },
};
