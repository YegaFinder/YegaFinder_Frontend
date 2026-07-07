import { z } from "zod";

/**
 * NEW: mirrors the backend's create-user.dto.ts regex exactly —
 * at least one uppercase, one lowercase, and one digit-or-special-char.
 * Keeping these in sync means a user never gets past client-side
 * validation only to be rejected by the server's forbidNonWhitelisted /
 * class-validator pipeline with a confusing error.
 */
const passwordRule = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        passwordRule,
        "Password must contain an uppercase letter, a lowercase letter, and a number or special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["Customer", "Merchant"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
