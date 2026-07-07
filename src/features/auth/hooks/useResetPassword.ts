"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import { authApi } from "../api/auth.api";
import { ROUTES } from "@/constants/routes";
import type { ResetPasswordFormValues } from "../schemas/reset-password.schema";

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  async function submit(values: ResetPasswordFormValues) {
    if (!email) {
      setError("Missing email — please request a new reset code.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // authApi.resetPassword returns void — the backend just confirms
      // success with a 200 and no body (see auth.api.ts).
      await authApi.resetPassword({
        email,
        otp: values.otp,
        newPassword: values.newPassword,
      });

      // Deliberately NOT logging the user in automatically — send them
      // to log in fresh with the new password instead.
      router.push(`${ROUTES.LOGIN}?resetSuccess=true`);
    } catch (err) {
      setError(getResetErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return { submit, isLoading, error, email };
}

function getResetErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 400) {
      return "That code is invalid or has expired, or your new password doesn't meet the requirements.";
    }
    if (err.response?.data?.message) {
      return err.response.data.message as string;
    }
  }
  return "Something went wrong. Please try again.";
}