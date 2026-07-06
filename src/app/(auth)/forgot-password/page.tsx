import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h1 className="text-2xl font-bold font-poppins text-foreground">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground font-inter">
          Enter your email and we&apos;ll send you reset instructions.
        </p>
      </div>

      <ForgotPasswordForm />
    </div>
  );
}