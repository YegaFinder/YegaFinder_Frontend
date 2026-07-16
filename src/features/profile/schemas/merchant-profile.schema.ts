import { z } from "zod";

/* ---------------------------- Business details --------------------------- */

export const businessDetailsSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters").max(100),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .or(z.literal("")),
});

export type BusinessDetailsFormValues = z.infer<typeof businessDetailsSchema>;

/* ----------------------------- Contact info ------------------------------ */

const phoneRegex = /^\+?[0-9]{7,15}$/;

export const contactInfoSchema = z.object({
  contactEmail: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  contactPhone: z
    .string()
    .regex(phoneRegex, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

/* ---------------------------- Business hours ---------------------------- */

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // 24-hour "HH:mm"
const optionalTime = z.string().regex(timeRegex, "Use HH:mm, e.g. 09:00").optional().or(z.literal(""));

const businessHourEntrySchema = z
  .object({
    dayOfWeek: z.enum(DAYS_OF_WEEK),
    isClosed: z.boolean(),
    is24Hours: z.boolean(),
    openTime: optionalTime,
    closeTime: optionalTime,
    breakStartTime: optionalTime,
    breakEndTime: optionalTime,
  })
  .refine(
    (entry) => entry.isClosed || entry.is24Hours || (!!entry.openTime && !!entry.closeTime),
    {
      message: "Set an opening and closing time, or mark this day Closed or 24 Hours.",
      path: ["openTime"],
    },
  )
  .refine(
    (entry) => entry.isClosed || entry.is24Hours || entry.openTime !== entry.closeTime,
    {
      // Overnight hours (e.g. open 18:00, close 02:00 — close is
      // numerically "before" open) are a valid real schedule, so this
      // never compares open > close. Only an exact match is ambiguous
      // enough to reject.
      message: "Opening and closing time can't be the same.",
      path: ["closeTime"],
    },
  )
  .refine(
    (entry) => (!entry.breakStartTime && !entry.breakEndTime) || (!!entry.breakStartTime && !!entry.breakEndTime),
    { message: "Set both a break start and end time, or leave both empty.", path: ["breakEndTime"] },
  )
  .refine(
    (entry) => !entry.breakStartTime || !entry.breakEndTime || entry.breakStartTime !== entry.breakEndTime,
    { message: "Break start and end time can't be the same.", path: ["breakEndTime"] },
  );

export const businessHoursSchema = z.object({
  hours: z.array(businessHourEntrySchema).length(7, "All 7 days must be included"),
});

export type BusinessHoursFormValues = z.infer<typeof businessHoursSchema>;

export function getDefaultBusinessHours(): BusinessHoursFormValues["hours"] {
  return DAYS_OF_WEEK.map((day) => ({
    dayOfWeek: day,
    isClosed: day === "Sunday",
    is24Hours: false,
    openTime: "09:00",
    closeTime: "18:00",
    breakStartTime: "",
    breakEndTime: "",
  }));
}