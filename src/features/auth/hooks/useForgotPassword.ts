"use client";

import { useState } from "react";
import axios from "axios";

import { authApi } from "../api/auth.api";
import type { ForgotPasswordFormValues } from "../schemas/forgot-password.schema";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function submit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const { message } = await authApi.forgotPassword(values);
      setSuccessMessage(message);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return { submit, isLoading, error, successMessage };
}

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    return err.response.data.message as string;
  }
  return "Something went wrong. Please try again.";
}