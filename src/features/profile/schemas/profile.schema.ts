import { z } from "zod";

export const profileSchema = z.object({
  dateOfBirth: z.string().optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  preferredLanguage: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const savedAddressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  address: z.string().min(1, "Address is required"),
});

export type SavedAddressFormValues = z.infer<typeof savedAddressSchema>;
