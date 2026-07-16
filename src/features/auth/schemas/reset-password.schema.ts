import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .length(6, "Enter the 6-digit code")
      .regex(/^\d+$/, "Code must contain only numbers"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;