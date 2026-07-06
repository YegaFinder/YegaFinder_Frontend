import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify OTP",
};

/**
 * OWNER: Person A — Sprint 1
 * Keep thin — swap the placeholder for <OtpForm /> once built
 * in features/auth/components/OtpForm.tsx.
 */
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

      {/* TODO(Person A): render <OtpForm /> here */}
      <p className="text-sm text-muted-foreground italic">
        TODO: OtpForm goes here.
      </p>
    </div>
  );
}
