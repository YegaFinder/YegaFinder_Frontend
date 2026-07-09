"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { authApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/constants/routes";
import type { RegisterRequest } from "../types/auth.types";

/**
 * NEW: this hook didn't exist in the original repo — RegisterForm
 * imported it, but the file was missing, so the register page couldn't
 * compile.
 */
export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUser = useAuthStore((state) => state.setUser);
  const setDevOtp = useAuthStore((state) => state.setDevOtp);
  const router = useRouter();

  async function register(payload: RegisterRequest) {
    setIsLoading(true);
    setError(null);

    try {
      const { otp } = await authApi.register(payload);

      // The backend doesn't return a user/tokens on register — just an
      // OTP-sent confirmation (see auth.api.ts). Stash the bits OtpForm
      // needs (it reads user?.email) so the verify-otp screen knows who
      // it's verifying. isVerified stays false until /auth/verify-otp
      // succeeds and the user logs in for real.
      setUser({
        id: "",
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        isVerified: false,
      });

      // `otp` is only present when the backend is running with
      // TEST_MODE=true (email delivery disabled) — see auth.api.ts.
      // OtpForm reads this to render a "here's your code" banner.
      setDevOtp(otp ?? null);

      router.push(ROUTES.VERIFY_OTP);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return { register, isLoading, error };
}

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    return err.response.data.message as string;
  }
  return "Something went wrong. Please try again.";
}