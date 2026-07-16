"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { registerSchema, type RegisterFormValues } from "../schemas/register.schema";
import { useRegister } from "../hooks/useRegister";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, FormError, Spinner } from "@/components/shared/form-feedback";
import { ROUTES } from "@/constants/routes";

export function RegisterForm() {
  const { register: registerUser, isLoading, error } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Customer",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormError message={error} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" aria-invalid={!!errors.firstName} {...register("firstName")} />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" aria-invalid={!!errors.lastName} {...register("lastName")} />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="role">I am a...</Label>
        <select
          id="role"
          className="flex h-11 w-full rounded-[14px] border border-yegna-border bg-yegna-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-yegna-primary"
          {...register("role")}
        >
          <option value="Customer">Customer</option>
          <option value="Merchant">Merchant</option>
        </select>
        <FieldError message={errors.role?.message} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Spinner />}
        {isLoading ? "Creating account..." : "Sign up"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="font-medium text-yegna-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}