import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
};

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

      <RegisterForm />
    </div>
  );
}
