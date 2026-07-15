"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { otpSchema, type OtpFormValues } from "../schemas/otp.schema";
import { useOtp } from "../hooks/useOtp";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, FormError, Spinner } from "@/components/shared/form-feedback";
import { DevOtpBanner } from "@/components/shared/dev-otp-banner";
import { ROUTES } from "@/constants/routes";

export function OtpForm() {
  const router = useRouter();
  // Reads the dedicated pendingVerificationEmail field (NOT user?.email
  // — there's no real, logged-in User yet at this point; see auth-store.ts).
  const pendingEmail = useAuthStore((state) => state.pendingVerificationEmail);
  const { verifyOtp, resendOtp, isLoading, isResending, error, resendSuccess } = useOtp();
  const [isMounted, setIsMounted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !pendingEmail) {
      router.push(ROUTES.LOGIN);
    }
  }, [pendingEmail, router, isMounted]);

  const onSubmit = (data: OtpFormValues) => {
    if (!pendingEmail) return;
    verifyOtp({ email: pendingEmail, otp: data.otp });
  };

  const onResend = () => {
    if (!pendingEmail) return;
    resendOtp(pendingEmail);
  };

  if (!isMounted || !pendingEmail) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormError message={error} />
      {resendSuccess && (
        <p className="text-sm font-medium text-emerald-600 text-center">{resendSuccess}</p>
      )}

      <p className="text-sm text-muted-foreground">
        Enter the 6-digit code sent to{" "}
        <span className="font-medium text-foreground">{pendingEmail}</span>.
      </p>

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
              // Strips anything that isn't an ASCII 0-9 before it
              // reaches validation — some IMEs/mobile numeric keyboards
              // can emit full-width Unicode digits (U+FF10-FF19) that
              // look identical but fail an ASCII-only regex.
              e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
            },
          })}
        />
        <FieldError message={errors.otp?.message} />
      </div>

      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
          disabled={isLoading || isResending}
        >
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading || isResending}>
          {isLoading && <Spinner />}
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Didn&apos;t receive a code?{" "}
        <button
          type="button"
          onClick={onResend}
          disabled={isResending || isLoading}
          className="font-medium text-yegna-primary hover:underline disabled:opacity-50"
        >
          {isResending ? "Sending..." : "Resend"}
        </button>
      </p>
    </form>
  );
}
