import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
};

/**
 * OWNER: Person B — Sprint 1
 * Keep thin — swap the placeholder for <ForgotPasswordForm /> once built
 * in features/auth/components/ForgotPasswordForm.tsx.
 */
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

      {/* TODO(Person B): render <ForgotPasswordForm /> here */}
      <p className="text-sm text-muted-foreground italic">
        TODO: ForgotPasswordForm goes here.
      </p>
    </div>
  );
}
