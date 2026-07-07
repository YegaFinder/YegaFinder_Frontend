import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from "./auth-storage";
import { useAuthStore } from "@/store/auth-store";

export const apiClient = axios.create({
  // FIXED: was "http://localhost:8000/api" — missing the backend's global
  // prefix. main.ts sets app.setGlobalPrefix('api/v1'), so every real
  // route lives under /api/v1, not /api. Every request 404'd before this.
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
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

/* ---- Response interceptor: silently refresh on a 401, retry once ---- */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");

        // Use the raw axios instance (not apiClient) so this call doesn't
        // go through the request interceptor above and attach the
        // already-expired access token — and so a failed refresh can't
        // loop back into this same interceptor infinitely.
        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refreshToken },
        );

        const { accessToken, refreshToken: newRefreshToken } = data.data;
        setTokens(accessToken, newRefreshToken);

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
