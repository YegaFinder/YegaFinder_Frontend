import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setTokens, removeTokens, getAccessToken } from "@/lib/auth-storage";
import type { User } from "@/features/auth/types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /**
   * TEST_MODE-only: the OTP the backend echoed back in its response
   * body (register / resend-verification / forgot-password) because
   * email sending is disabled. Deliberately excluded from `partialize`
   * below — it should never survive a refresh or leak into storage,
   * and it gets cleared the moment it's no longer relevant (submitted,
   * or a fresh code is requested). Remove this whole field once SMTP /
   * Resend is confirmed working everywhere and TEST_MODE stays off.
   */
  devOtp: string | null;

  setUser: (user: User | null) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  setDevOtp: (otp: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      // On first load, trust that a stored token means "probably still
      // logged in" — the api-client's 401 handling corrects this the
      // moment a real request proves the token is actually expired.
      isAuthenticated: !!getAccessToken(),
      isLoading: false,
      devOtp: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setDevOtp: (otp) => set({ devOtp: otp }),

      login: (user, accessToken, refreshToken) => {
        setTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        removeTokens();
        set({ user: null, isAuthenticated: false, devOtp: null });
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
      // Only persist `user` — isAuthenticated is re-derived from the
      // token, and isLoading is transient UI state that shouldn't survive
      // a refresh.
      partialize: (state) => ({ user: state.user }),
    },
  ),
);