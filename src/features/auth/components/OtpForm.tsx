"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OtpFormValues } from "../schemas/otp.schema";
import { useOtp } from "../hooks/useOtp";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function OtpForm() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { verifyOtp, isLoading, error } = useOtp();
  const [isMounted, setIsMounted] = useState(false);

  const {
    register,
    handleSubmit,
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
    if (isMounted && !user?.email) {
      router.push("/login");
    }
  }, [user, router, isMounted]);

  const onSubmit = (data: OtpFormValues) => {
    if (!user?.email) return;
    verifyOtp({ email: user.email, otp: data.otp });
  };

  if (!isMounted || !user?.email) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <div className="text-sm font-medium text-destructive">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input 
          id="otp" 
          placeholder="000000" 
          maxLength={6}
          {...register("otp")} 
          aria-invalid={!!errors.otp} 
        />
        {errors.otp && <p className="text-xs text-destructive">{errors.otp.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>
    </form>
  );
}
