"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/constants/routes";
import { getErrorMessage } from "@/lib/errors";
import type { RegisterRequest } from "../types/auth.types";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setPendingVerificationEmail = useAuthStore((state) => state.setPendingVerificationEmail);
  const setDevOtp = useAuthStore((state) => state.setDevOtp);
  const router = useRouter();

  async function register(payload: RegisterRequest) {
    setIsLoading(true);
    setError(null);

    try {
      const { otp } = await authApi.register(payload);

      
      setPendingVerificationEmail(payload.email);

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
