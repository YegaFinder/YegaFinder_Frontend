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
   *
   * Returns `{ otp }` — `otp` is only populated when the backend is
   * running with TEST_MODE=true (see .env.example / OtpService). This
   * lets callers surface the code in the UI while transactional email
   * is down, without the API layer having to know *why* it's present.
   */
  register: async (payload: RegisterRequest): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post<ApiResponse<DevOtpResponse | null>>(
      "/auth/register",
      payload,
    );
    return { otp: data.data?.otp };
  },

  /**
   * FIXED: same issue as register — verify-otp only marks the email
   * verified server-side and returns `data: null`. It does NOT log the
   * user in. The frontend must send them to /login afterward.
   */
  verifyOtp: async (payload: VerifyOtpRequest): Promise<void> => {
    await apiClient.post("/auth/verify-otp", payload);
  },

  /**
   * Same TEST_MODE contract as register: `otp` is populated only when
   * the backend has email sending disabled.
   */
  resendVerification: async (payload: { email: string }): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post<ApiResponse<DevOtpResponse | null>>(
      "/auth/resend-verification",
      payload,
    );
    return { otp: data.data?.otp };
  },

  /**
   * FIXED: return type corrected — backend returns `data: null` for an
   * unknown email (by design, so the endpoint doesn't leak whether an
   * account exists) but `data: { otp }` for a known email when
   * TEST_MODE=true. Callers should treat `otp` as optional either way.
   */
  forgotPassword: async (payload: ForgotPasswordRequest): Promise<DevOtpResponse> => {
    const { data } = await apiClient.post<ApiResponse<DevOtpResponse | null>>(
      "/auth/forgot-password",
      payload,
    );
    return { otp: data.data?.otp };
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