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
      // `replace` (not `push`) so /login isn't left in browser history —
      // otherwise hitting Back after logging in lands right back on the
      // login form.
      const redirectTo = searchParams.get("redirectTo");
      router.replace(redirectTo || ROUTES.APP_HOME);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        // Stash the email in the store so OtpForm knows who to verify
        useAuthStore.getState().setUser({ 
          id: "", 
          email: values.email, 
          firstName: "", 
          lastName: "", 
          role: "Customer", 
          isVerified: false 
        });
        router.push(ROUTES.VERIFY_OTP);
        return;
      }
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