import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from "./auth-storage";
import { useAuthStore } from "@/store/auth-store";
import { env } from "./env";

const getBaseUrl = () => {
  let url = env.NEXT_PUBLIC_API_URL;
  if (!url.endsWith("/api/v1")) {
    url = url.replace(/\/$/, "") + "/api/v1";
  }
  return url;
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    // POST /auth/refresh — Pattern A, data: { accessToken, refreshToken }
    const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, { refreshToken });
    const auth = data.data as { accessToken: string; refreshToken: string };
    setTokens(auth.accessToken, auth.refreshToken);
    return auth.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

// Endpoints where a 401 means "bad credentials/OTP", not "expired session" —
// never trigger the refresh-and-retry flow for these.
const AUTH_ENDPOINTS_EXCLUDED_FROM_REFRESH = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/verify-otp",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/resend-verification",
];

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  return AUTH_ENDPOINTS_EXCLUDED_FROM_REFRESH.some((path) => url.includes(path));
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      if (!getRefreshToken()) {
        return Promise.reject(error);
      }

      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        removeTokens();
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      if (retryAfter) {
        error.response.data = error.response.data || {};
        error.response.data.message = `Too many attempts. Please try again in ${retryAfter} seconds.`;
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);