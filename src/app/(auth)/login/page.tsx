import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

/**
 * OWNER: Person B — Sprint 1
 *
 * This file should stay THIN. Its only job is routing — deciding that the
 * URL /login shows the login form. Do not put form fields, validation, or
 * submit logic directly in this file.
 *
 * Once features/auth/components/LoginForm.tsx exists, replace the
 * placeholder below with:
 *
 *   import { LoginForm } from "@/features/auth/components/LoginForm";
 *   export default function LoginPage() {
 *     return <LoginForm />;
 *   }
 */
export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-left">
        <h1 className="text-2xl font-bold font-poppins text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground font-inter">
          Log in to continue discovering YegnaFinder.
        </p>
      </div>

      {/* TODO(Person B): render <LoginForm /> here */}
      <p className="text-sm text-muted-foreground italic">
        TODO: LoginForm goes here.
      </p>
    </div>
  );
}
