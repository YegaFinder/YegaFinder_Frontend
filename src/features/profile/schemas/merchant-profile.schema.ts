import { z } from "zod";
import type { BusinessHours, UpdateBusinessHoursRequest } from "../types/profile.types";

// Matches BusinessHoursDto exactly (BACKEND_INTEGRATION_GUIDE.md §5.9).
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
// Backend does NOT format-check phone (§5.1) — this is purely client-side UX.
const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

// ---------------------------------------------------------------------------
// Business details
// ---------------------------------------------------------------------------

export const businessDetailsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  description: z.string().max(2000, "Keep it under 2000 characters").optional().or(z.literal("")),
  businessCategories: z.array(z.string().min(1)).optional(),
  logoUrl: z.string().optional().or(z.literal("")),
  bannerUrl: z.string().optional().or(z.literal("")),
});
export type BusinessDetailsFormValues = z.infer<typeof businessDetailsSchema>;

// ---------------------------------------------------------------------------
// Contact info
// ---------------------------------------------------------------------------

export const contactInfoSchema = z.object({
  // contactEmail is the ONE contact field the backend format-checks
  // (@IsEmail) — keep this strict so we never send an unparseable one.
  contactEmail: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  contactPhone: z.string().regex(phoneRegex, "Enter a valid phone number").optional().or(z.literal("")),
  businessAddress: z.string().optional().or(z.literal("")),
  websiteUrl: z.string().url("Enter a valid URL, e.g. https://example.com").optional().or(z.literal("")),
});
export type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

// ---------------------------------------------------------------------------
// Business hours
// ---------------------------------------------------------------------------

const businessHoursDaySchema = z
  .object({
    dayOfWeek: z.enum(DAYS_OF_WEEK),
    isClosed: z.boolean(),
    is24Hours: z.boolean(),
    openTime: z.string().regex(timeRegex, "Use HH:MM (24h)").optional().or(z.literal("")),
    closeTime: z.string().regex(timeRegex, "Use HH:MM (24h)").optional().or(z.literal("")),
    breakStartTime: z.string().regex(timeRegex, "Use HH:MM (24h)").optional().or(z.literal("")),
    breakEndTime: z.string().regex(timeRegex, "Use HH:MM (24h)").optional().or(z.literal("")),
  })
  .superRefine((day, ctx) => {
    // Mirrors the backend's hand-written business logic exactly
    // (BACKEND_INTEGRATION_GUIDE.md §5.9), so the user sees the same
    // rejection client-side instead of a wasted round trip.
    if (day.isClosed || day.is24Hours) return;

    if (!day.openTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["openTime"], message: `Open time is required for ${day.dayOfWeek}` });
    }
    if (!day.closeTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["closeTime"], message: `Close time is required for ${day.dayOfWeek}` });
    }

    // String comparison — NOT real time math. Overnight hours crossing
    // midnight (open 22:00, close 02:00) will always fail this, exactly
    // like the backend. Don't build a workaround for it on this side;
    // it needs a backend change to support.
    if (day.openTime && day.closeTime && day.openTime >= day.closeTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["closeTime"],
        message: `Close time must be after open time for ${day.dayOfWeek} (overnight hours aren't supported yet)`,
      });
    }

    const hasBreakStart = !!day.breakStartTime;
    const hasBreakEnd = !!day.breakEndTime;
    if (hasBreakStart !== hasBreakEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["breakEndTime"],
        message: `Both break start and end times are required for ${day.dayOfWeek}`,
      });
    } else if (hasBreakStart && hasBreakEnd) {
      if (day.breakStartTime! >= day.breakEndTime!) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["breakEndTime"],
          message: `Break end time must be after break start time for ${day.dayOfWeek}`,
        });
      }
      if (day.openTime && day.closeTime && !(day.breakStartTime! > day.openTime && day.breakEndTime! < day.closeTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["breakStartTime"],
          message: `Break time must be within business hours for ${day.dayOfWeek}`,
        });
      }
    }
  });

export const businessHoursSchema = z.object({
  businessHours: z.array(businessHoursDaySchema).length(7, "All 7 days must be set"),
});
export type BusinessHoursFormValues = z.infer<typeof businessHoursSchema>;
export type BusinessHoursDayValues = z.infer<typeof businessHoursDaySchema>;

/**
 * Builds a full 7-day default set, merging in whatever the server
 * already has. A brand-new merchant has no BusinessHours rows at all
 * (they're only created by the first PUT to this endpoint) — default
 * every day to Closed rather than leaving required fields empty.
 */
export function buildDefaultBusinessHours(existing?: BusinessHours[]): BusinessHoursDayValues[] {
  return DAYS_OF_WEEK.map((day) => {
    const match = existing?.find((h) => h.dayOfWeek === day);
    return {
      dayOfWeek: day,
      isClosed: match?.isClosed ?? true,
      is24Hours: match?.is24Hours ?? false,
      openTime: match?.openTime ?? "",
      closeTime: match?.closeTime ?? "",
      breakStartTime: match?.breakStartTime ?? "",
      breakEndTime: match?.breakEndTime ?? "",
    };
  });
}

/**
 * Converts form values to the wire payload. Critically: empty-string
 * time fields become `undefined`, not `""` — the backend's @Matches
 * regex on openTime/closeTime/etc. still runs against an empty string
 * even though the field is @IsOptional(), and an empty string fails
 * it. Only `undefined` actually skips validation.
 */
export function toBusinessHoursPayload(
  values: BusinessHoursFormValues["businessHours"],
): UpdateBusinessHoursRequest["businessHours"] {
  return values.map(({ dayOfWeek, isClosed, is24Hours, openTime, closeTime, breakStartTime, breakEndTime }) => ({
    dayOfWeek,
    isClosed,
    is24Hours,
    openTime: openTime || undefined,
    closeTime: closeTime || undefined,
    breakStartTime: breakStartTime || undefined,
    breakEndTime: breakEndTime || undefined,
  }));
}