"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import { authApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/constants/routes";
import { getErrorMessage } from "@/lib/errors";
import type { LoginFormValues } from "../schemas/login.schema";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storeLogin = useAuthStore((state) => state.login);
  const setPendingVerificationEmail = useAuthStore((state) => state.setPendingVerificationEmail);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function login(values: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const { user, accessToken, refreshToken } = await authApi.login(values);
      storeLogin(user, accessToken, refreshToken);

      // Redirect to the page the user was on before logging in
      const redirectTo = searchParams.get("redirectTo");
      router.replace(redirectTo || ROUTES.APP_HOME);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        
        setPendingVerificationEmail(values.email);
        router.push(ROUTES.VERIFY_OTP);
        return;
      }
      setError(getErrorMessage(err, { 401: "Incorrect email or password." }));
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading, error };
}
