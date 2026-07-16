import { z } from "zod";

/**
 * Only fields that actually exist on `CustomerProfile` (see
 * ../types/profile.types.ts). firstName/lastName/phone live on `User`
 * (features/auth) and have no confirmed edit endpoint yet, so they're
 * intentionally not part of this schema — see CustomerProfileForm's
 * docblock.
 */
export const profileSchema = z.object({
  dateOfBirth: z.string().optional().or(z.literal("")),
  bio: z.string().max(280, "Bio must be at most 280 characters").optional().or(z.literal("")),
  preferredLanguage: z.enum(["en", "am"]),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

/**
 * `SavedAddress` on main is a single free-text `address` field (no
 * addressLine1/2, city, region, or isDefault) — see the type's docblock
 * and CreateSavedAddressRequest for why latitude/longitude aren't
 * collected from the user here either.
 */
export const savedAddressSchema = z.object({
  label: z.string().min(1, "Label is required (e.g. Home, Work)"),
  address: z.string().min(1, "Address is required"),
});

export type SavedAddressFormValues = z.infer<typeof savedAddressSchema>;
