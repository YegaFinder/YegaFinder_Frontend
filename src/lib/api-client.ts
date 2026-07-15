import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from "./auth-storage";
import { useAuthStore } from "@/store/auth-store";
import { env } from "./env";

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---- Request interceptor: attach the access token to every call ---- */
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

/**
 * If several requests 401 at the same moment (e.g. a page firing
 * multiple parallel queries right after the access token expired),
 * each one would otherwise independently call POST /auth/refresh.
 * Depending on whether the backend rotates refresh tokens on use, this
 * can invalidate a sibling request's retry or silently log the user
 * out. So: the first 401 starts the refresh and stores the in-flight
 * Promise; every other 401 that arrives while it's pending awaits that
 * same Promise instead of starting its own.
 */
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    // Use the raw axios instance (not apiClient) so this call doesn't
    // go through the request interceptor above and attach the
    // already-expired access token — and so a failed refresh can't
    // loop back into this same interceptor infinitely.
    const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = data.data;
    setTokens(accessToken, newRefreshToken);
    return accessToken as string;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

/* ---- Response interceptor: silently refresh on a 401, retry once ---- */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

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

    return Promise.reject(error);
  },
);
