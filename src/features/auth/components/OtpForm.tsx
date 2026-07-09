"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OtpFormValues } from "../schemas/otp.schema";
import { useOtp } from "../hooks/useOtp";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

export function OtpForm() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { verifyOtp, resendOtp, isLoading, isResending, error, resendSuccess } = useOtp();
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

  const onResend = () => {
    if (!user?.email) return;
    resendOtp(user.email);
  };

  if (!isMounted || !user?.email) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && <div className="text-sm font-medium text-red-400 text-center">{error}</div>}
      {resendSuccess && <div className="text-sm font-medium text-green-400 text-center">{resendSuccess}</div>}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <MessageSquare className="h-5 w-5" />
        </div>
        <Input 
          id="otp" 
          placeholder="Enter 6-Digit OTP" 
          maxLength={6}
          className="pl-12 bg-transparent border-slate-600 text-white placeholder:text-slate-400 h-12 rounded-lg focus-visible:ring-[#2563eb]"
          {...register("otp")} 
          aria-invalid={!!errors.otp} 
        />
        {errors.otp && <p className="text-xs text-red-400 mt-1 pl-2">{errors.otp.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1 border-slate-600 bg-transparent text-[#3b82f6] hover:bg-slate-800 hover:text-[#3b82f6] h-12 rounded-lg tracking-widest font-semibold"
          onClick={() => router.back()}
          disabled={isLoading || isResending}
        >
          BACK
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-[#1d4ed8] hover:bg-[#1e40af] text-white h-12 rounded-lg tracking-widest font-semibold border-none" 
          disabled={isLoading || isResending}
        >
          {isLoading ? "..." : "VERIFY"}
        </Button>
      </div>

      <div className="text-center mt-2">
        <button
          type="button"
          onClick={onResend}
          disabled={isResending || isLoading}
          className="text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-50"
        >
          {isResending ? "Sending..." : "Didn't receive a code? Resend"}
        </button>
      </div>
    </form>
  );
}
