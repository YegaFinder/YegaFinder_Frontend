"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, FormError, Spinner } from "@/components/shared/form-feedback";
import { DevOtpBanner } from "@/components/shared/dev-otp-banner";
import { ROUTES } from "@/constants/routes";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/reset-password.schema";
import { useResetPassword } from "../hooks/useResetPassword";

export function ResetPasswordForm() {
  const { submit, isLoading, error, email } = useResetPassword();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: "", newPassword: "", confirmNewPassword: "" },
  });

  if (!email) {
    return (
      <div className="space-y-4 text-center">
        <FormError message="We couldn't find a pending reset request." />
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="inline-block text-sm text-yegna-primary font-medium hover:underline"
        >
          Request a new code
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <FormError message={error} />

      <p className="text-sm text-muted-foreground">
        Enter the code sent to{" "}
        <span className="font-medium text-foreground">{email}</span> and choose a new password.
      </p>

      <DevOtpBanner onUse={(otp) => setValue("otp", otp, { shouldValidate: true })} />

      <div className="space-y-1.5">
        <Label htmlFor="otp">Reset code</Label>
        <Input
          id="otp"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          className="text-center text-lg tracking-[0.5em]"
          {...register("otp", {
            onChange: (e) => {
              // Strip anything that isn't an ASCII 0-9 — mobile OTP
              // autofill / non-Latin keyboards can insert visually
              // identical characters (e.g. fullwidth digits) that pass
              // the eye test but fail the \d regex below.
              e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
            },
          })}
        />
        <FieldError message={errors.otp?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
        />
        <FieldError message={errors.newPassword?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmNewPassword">Confirm new password</Label>
        <Input
          id="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmNewPassword")}
        />
        <FieldError message={errors.confirmNewPassword?.message} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Spinner />}
        {isLoading ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  );
}