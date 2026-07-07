"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import { authApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/constants/routes";
import type { LoginFormValues } from "../schemas/login.schema";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storeLogin = useAuthStore((state) => state.login);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function login(values: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const { user, accessToken, refreshToken } = await authApi.login(values);
      storeLogin(user, accessToken, refreshToken);

      // If middleware redirected a logged-out user to /login?redirectTo=/profile,
      // send them back to where they were headed instead of always to home.
      const redirectTo = searchParams.get("redirectTo");
      router.push(redirectTo || ROUTES.HOME);
    } catch (err) {
      setError(getLoginErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading, error };
}

function getLoginErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 401) {
      return "Incorrect email or password.";
    }
    if (err.response?.data?.message) {
      return err.response.data.message as string;
    }
  }
  return "Something went wrong. Please try again.";
}
