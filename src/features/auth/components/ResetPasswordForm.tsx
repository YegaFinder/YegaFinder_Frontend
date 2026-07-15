"use client";

/**
 * RECONSTRUCTED — same caveat as LoginForm.tsx: referenced by
 * src/app/(auth)/reset-password/page.tsx and by useResetPassword.ts's
 * contract (otp, newPassword, confirmNewPassword), but the original
 * source was never shown to me. Diff against the real file before
 * committing.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/reset-password.schema";
import { useResetPassword } from "../hooks/useResetPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, FormError, Spinner } from "@/components/shared/form-feedback";
import { DevOtpBanner } from "@/components/shared/dev-otp-banner";

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

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      <FormError message={error} />

      {email && (
        <p className="text-sm text-muted-foreground">
          Enter the code sent to <span className="font-medium text-foreground">{email}</span>{" "}
          along with your new password.
        </p>
      )}

      <DevOtpBanner onUse={(otp) => setValue("otp", otp, { shouldValidate: true })} />

      <div className="space-y-1.5">
        <Label htmlFor="otp">Verification code</Label>
        <Input
          id="otp"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          className="text-center text-lg tracking-[0.5em]"
          aria-invalid={!!errors.otp}
          {...register("otp", {
            onChange: (e) => {
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
          aria-invalid={!!errors.newPassword}
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
          aria-invalid={!!errors.confirmNewPassword}
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
