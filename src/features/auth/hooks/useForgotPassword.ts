"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { authApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/constants/routes";
import type { ForgotPasswordFormValues } from "../schemas/forgot-password.schema";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setDevOtp = useAuthStore((state) => state.setDevOtp);
  const router = useRouter();

  async function submit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      // The endpoint always "succeeds" whether or not the email exists
      // (so it can't be used to enumerate accounts), so we move
      // straight to the next step regardless. `otp` is only populated
      // when TEST_MODE=true AND the email is registered — see
      // auth.api.ts — so this is just as safe to read either way.
      const { otp } = await authApi.forgotPassword(values);
      setDevOtp(otp ?? null);
      router.push(`${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return { submit, isLoading, error };
}

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    return err.response.data.message as string;
  }
  return "Something went wrong. Please try again.";
}