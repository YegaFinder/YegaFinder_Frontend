import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setTokens, removeTokens, getAccessToken } from "@/lib/auth-storage";
import type { User } from "@/features/auth/types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

 
  devOtp: string | null;

  
  pendingVerificationEmail: string | null;

  setUser: (user: User | null) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  setDevOtp: (otp: string | null) => void;
  setPendingVerificationEmail: (email: string | null) => void;
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
      pendingVerificationEmail: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setDevOtp: (otp) => set({ devOtp: otp }),
      setPendingVerificationEmail: (email) => set({ pendingVerificationEmail: email }),

      login: (user, accessToken, refreshToken) => {
        setTokens(accessToken, refreshToken, user?.role);
        set({ user, isAuthenticated: true, pendingVerificationEmail: null });
      },

      logout: () => {
        removeTokens();
        set({ user: null, isAuthenticated: false, devOtp: null, pendingVerificationEmail: null });
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
      // Only persist `user` — isAuthenticated is re-derived from the
      // token, and isLoading/devOtp/pendingVerificationEmail are all
      // transient UI state that shouldn't survive a refresh.
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
