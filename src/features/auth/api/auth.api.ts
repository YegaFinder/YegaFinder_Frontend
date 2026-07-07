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

  /**
   * FIXED: the backend returns `data: null` for register (it only sends
   * an OTP email — no tokens, no user). Previously typed as returning
   * AuthResponse, which meant any caller destructuring
   * `{ user, accessToken, refreshToken }` off the result would crash.
   */
  register: async (payload: RegisterRequest): Promise<void> => {
    await apiClient.post("/auth/register", payload);
  },

  /**
   * FIXED: same issue as register — verify-otp only marks the email
   * verified server-side and returns `data: null`. It does NOT log the
   * user in. The frontend must send them to /login afterward.
   */
  verifyOtp: async (payload: VerifyOtpRequest): Promise<void> => {
    await apiClient.post("/auth/verify-otp", payload);
  },

  resendVerification: async (payload: { email: string }): Promise<void> => {
    await apiClient.post("/auth/resend-verification", payload);
  },

  /**
   * FIXED: return type corrected to void — backend returns
   * `data: null` here too (the "if the email exists..." message is
   * informational only, not something callers should rely on reading).
   */
  forgotPassword: async (payload: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post("/auth/forgot-password", payload);
  },

  /**
   * FIXED: return type corrected to void — same `data: null` pattern.
   */
  resetPassword: async (payload: ResetPasswordRequest): Promise<void> => {
    await apiClient.post("/auth/reset-password", payload);
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
    return data.data;
  },

  /**
   * FIXED: backend's RefreshTokenDto requires `refreshToken`
   * (@IsNotEmpty()) in the body. The original call sent no body at all,
   * which would always 400 under the global ValidationPipe. Now reads
   * the stored refresh token and sends it.
   *
   * Note: this only revokes the token server-side. Callers are still
   * responsible for clearing local state afterward, e.g.:
   *   await authApi.logout();
   *   useAuthStore.getState().logout();
   */
  logout: async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    await apiClient.post("/auth/logout", { refreshToken });
  },

  logoutAll: async (): Promise<void> => {
    await apiClient.post("/auth/logout-all");
  },
};
