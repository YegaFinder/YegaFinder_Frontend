import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

/**
 * OWNER: Person A — Sprint 1
 * Keep thin — swap the placeholder for <RegisterForm /> once built
 * in features/auth/components/RegisterForm.tsx.
 */
export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h1 className="text-2xl font-bold font-poppins text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground font-inter">
          Join YegnaFinder to discover and book trusted local businesses.
        </p>
      </div>

      {/* TODO(Person A): render <RegisterForm /> here */}
      <p className="text-sm text-muted-foreground italic">
        TODO: RegisterForm goes here.
      </p>
    </div>
  );
}
