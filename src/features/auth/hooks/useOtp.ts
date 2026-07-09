"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { authApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/constants/routes";
import type { VerifyOtpRequest } from "../types/auth.types";

/**
 * NEW: this hook didn't exist in the original repo — OtpForm imported
 * it, but the file was missing, so the verify-otp page couldn't compile.
 */
export function useOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  const setDevOtp = useAuthStore((state) => state.setDevOtp);
  const router = useRouter();

  async function verifyOtp(payload: VerifyOtpRequest) {
    setIsLoading(true);
    setError(null);
    setResendSuccess(null);

    try {
      await authApi.verifyOtp(payload);
      // No tokens come back from this endpoint (see auth.api.ts) — the
      // user still has to log in for real afterward. Clear any dev OTP
      // we were showing — it's been consumed either way.
      setDevOtp(null);
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
      // `otp` is only present under TEST_MODE=true (see auth.api.ts) —
      // replaces whatever code was shown before with the fresh one.
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

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    return err.response.data.message as string;
  }
  return "Something went wrong. Please try again.";
}