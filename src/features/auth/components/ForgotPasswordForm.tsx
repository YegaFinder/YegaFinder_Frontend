"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, FormError, Spinner } from "@/components/shared/form-feedback";
import { ROUTES } from "@/constants/routes";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/forgot-password.schema";
import { useForgotPassword } from "../hooks/useForgotPassword";

export function ForgotPasswordForm() {
  const { submit, isLoading, error, successMessage } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  // Once the request succeeds, swap the form out for a confirmation state
  // entirely — there's nothing left for the user to submit.
  if (successMessage) {
    return (
      <div className="space-y-5 text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="size-12 text-yegna-primary" />
        </div>
        <p className="text-sm text-foreground">{successMessage}</p>
        <Link
          href={ROUTES.LOGIN}
          className="inline-block text-sm text-yegna-primary font-medium hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <FormError message={error} />

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Spinner />}
        {isLoading ? "Sending..." : "Send reset instructions"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link href={ROUTES.LOGIN} className="text-yegna-primary font-medium hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}