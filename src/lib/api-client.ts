import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from "./auth-storage";
import { useAuthStore } from "@/store/auth-store";
import { env } from "./env";

const getBaseUrl = () => {
  let url = env.NEXT_PUBLIC_API_URL;
  if (url && !url.endsWith("/api/v1")) {
    url = url.replace(/\/$/, "") + "/api/v1";
  }
  return url;
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
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

    const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, { refreshToken });
    // AuthResponseDto is nested under the standard envelope — NOT flat.
    const auth = data.data as { accessToken: string; refreshToken: string };
    // Token rotation (BACKEND_INTEGRATION_GUIDE.md §2): the OLD refresh
    // token is revoked the instant this call succeeds. Both must be
    // overwritten, or the next refresh attempt reuses a dead token and
    // gets a hard 401 with no recovery path.
    setTokens(auth.accessToken, auth.refreshToken);
    return auth.accessToken;
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
      if (retryAfter) {
        error.response.data = error.response.data || {};
        error.response.data.message = `Too many attempts. Please try again in ${retryAfter} seconds.`;
      }

      return Promise.reject(error);
    }

    // Anything not specifically handled above (404, 500, network errors, etc.)
    // must still be rejected, or axios treats the interceptor's implicit
    // `undefined` return as a *successful* response and callers blow up
    // trying to destructure `.data` off of it.
    return Promise.reject(error);
  },
);