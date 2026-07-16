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

// ---- Refresh token ---- 
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    // Send the refresh token to the backend to get a new access token and refresh token 
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

    if (error.response?.status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      const message = retryAfter
        ? `Too many attempts. Please try again in ${retryAfter} seconds.`
        : "Too many attempts. Please try again shortly.";

      // Override the error message so UI can simply show it
      error.response.data = error.response.data || {};
      error.response.data.message = message;
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);