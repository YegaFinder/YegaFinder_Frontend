import type { Metadata } from "next";
import { OtpForm } from "@/features/auth/components/OtpForm";

export const metadata: Metadata = {
  title: "Verify OTP",
};

export default function VerifyOtpPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h1 className="text-2xl font-bold font-poppins text-foreground">
          Verify your account
        </h1>
        <p className="text-sm text-muted-foreground font-inter">
          Enter the code we sent to your email or phone.
        </p>
      </div>

      <OtpForm />
    </div>
  );
}
