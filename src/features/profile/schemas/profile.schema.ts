import { z } from "zod";

export const profileSchema = z.object({
  dateOfBirth: z.string().optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  preferredLanguage: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;