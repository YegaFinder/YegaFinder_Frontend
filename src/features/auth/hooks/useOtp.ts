"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/constants/routes";
import { getErrorMessage } from "@/lib/errors";
import type { VerifyOtpRequest } from "../types/auth.types";

export function useOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  const setDevOtp = useAuthStore((state) => state.setDevOtp);
  const setPendingVerificationEmail = useAuthStore((state) => state.setPendingVerificationEmail);
  const router = useRouter();

  async function verifyOtp(payload: VerifyOtpRequest) {
    setIsLoading(true);
    setError(null);
    setResendSuccess(null);

    try {
      await authApi.verifyOtp(payload);
      // Confirmed against the backend controller: this endpoint returns
      // data: null, no tokens — the user still has to log in for real
      // afterward. Clear any dev OTP and the pending-verification
      // marker, then send them to /login (NOT a dashboard).
      setDevOtp(null);
      setPendingVerificationEmail(null);
      router.push(ROUTES.LOGIN);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function resendOtp(email: string) {
    setIsResending(true);
    setError(null);
    setResendSuccess(null);

    try {
      const { otp } = await authApi.resendVerification({ email });
      setDevOtp(otp ?? null);
      setResendSuccess("A new verification code has been sent to your email.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  }

  return { verifyOtp, resendOtp, isLoading, isResending, error, resendSuccess };
}
