"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { authApi } from "../api/auth.api";
import { ROUTES } from "@/constants/routes";
import type { VerifyOtpRequest } from "../types/auth.types";

/**
 * NEW: this hook didn't exist in the original repo — OtpForm imported
 * it, but the file was missing, so the verify-otp page couldn't compile.
 */
export function useOtp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function verifyOtp(payload: VerifyOtpRequest) {
    setIsLoading(true);
    setError(null);

    try {
      await authApi.verifyOtp(payload);
      // No tokens come back from this endpoint (see auth.api.ts) — the
      // user still has to log in for real afterward.
      router.push(ROUTES.LOGIN);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return { verifyOtp, isLoading, error };
}

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    return err.response.data.message as string;
  }
  return "Something went wrong. Please try again.";
}
