"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  businessHoursSchema,
  getDefaultBusinessHours,
  type BusinessHoursFormValues,
} from "../schemas/merchant-profile.schema";
import { useUpdateBusinessHours } from "../hooks/useMerchantProfile";
import { Button } from "@/components/ui/button";
import { FieldError, FormError, Spinner } from "@/components/shared/form-feedback";
import { getErrorMessage } from "@/lib/errors";
import type { BusinessHours } from "../types/profile.types";

interface BusinessHoursEditorProps {
  hours: BusinessHours[] | null | undefined;
}

function toFormHours(hours: BusinessHours[] | null | undefined): BusinessHoursFormValues["hours"] {
  if (!hours || hours.length !== 7) return getDefaultBusinessHours();
  return hours.map((h) => ({
    dayOfWeek: h.dayOfWeek,
    isClosed: h.isClosed,
    is24Hours: h.is24Hours,
    openTime: h.openTime ?? "",
    closeTime: h.closeTime ?? "",
    breakStartTime: h.breakStartTime ?? "",
    breakEndTime: h.breakEndTime ?? "",
  }));
}

export function BusinessHoursEditor({ hours }: BusinessHoursEditorProps) {
  const { mutate, isPending, error } = useUpdateBusinessHours();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BusinessHoursFormValues>({
    resolver: zodResolver(businessHoursSchema),
    defaultValues: { hours: toFormHours(hours) },
  });

  // `hours` arrives asynchronously (the query resolves after mount) —
  // resync once real data shows up. reset() (not the `values` option
  // used elsewhere) since this form's fields are index-addressed array
  // entries rather than flat named fields.
  useEffect(() => {
    if (hours) reset({ hours: toFormHours(hours) });
  }, [hours, reset]);

  const watchedHours = watch("hours");

  const onSubmit = (data: BusinessHoursFormValues) => {
    mutate(
      data.hours.map((entry) => ({
        ...entry,
        openTime: entry.isClosed || entry.is24Hours ? undefined : entry.openTime || undefined,
        closeTime: entry.isClosed || entry.is24Hours ? undefined : entry.closeTime || undefined,
        breakStartTime: entry.breakStartTime || undefined,
        breakEndTime: entry.breakEndTime || undefined,
      })),
      {
        onSuccess: () => toast.success("Business hours updated."),
        onError: () => toast.error("Failed to update business hours."),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormError message={error ? getErrorMessage(error) : undefined} />

      <div className="space-y-3">
        {watchedHours?.map((entry, index) => {
          const isClosed = watchedHours[index]?.isClosed;
          const is24Hours = watchedHours[index]?.is24Hours;
          const timesDisabled = isClosed || is24Hours;

          return (
            <div
              key={entry.dayOfWeek}
              className="flex flex-col gap-2 rounded-[14px] border border-yegna-border bg-yegna-background p-3"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="w-24 shrink-0 text-sm font-medium">{entry.dayOfWeek}</span>

                <input type="hidden" {...register(`hours.${index}.dayOfWeek`)} />

                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    aria-label={`${entry.dayOfWeek} closed toggle`}
                    className="size-4 rounded border-yegna-border"
                    {...register(`hours.${index}.isClosed`)}
                  />
                  Closed
                </label>

                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    aria-label={`${entry.dayOfWeek} 24 hours toggle`}
                    className="size-4 rounded border-yegna-border"
                    disabled={isClosed}
                    {...register(`hours.${index}.is24Hours`)}
                  />
                  24 Hours
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    disabled={timesDisabled}
                    aria-label={`${entry.dayOfWeek} opening time`}
                    className="h-9 rounded-[10px] border border-yegna-border bg-background px-2 text-sm disabled:opacity-40"
                    {...register(`hours.${index}.openTime`)}
                  />
                  <span className="text-sm text-muted-foreground">to</span>
                  <input
                    type="time"
                    disabled={timesDisabled}
                    aria-label={`${entry.dayOfWeek} closing time`}
                    className="h-9 rounded-[10px] border border-yegna-border bg-background px-2 text-sm disabled:opacity-40"
                    {...register(`hours.${index}.closeTime`)}
                  />
                </div>
              </div>

              {!timesDisabled && (
                <div className="flex items-center gap-2 pl-[6.5rem]">
                  <span className="text-xs text-muted-foreground">Break (optional):</span>
                  <input
                    type="time"
                    aria-label={`${entry.dayOfWeek} break start time`}
                    className="h-8 rounded-[10px] border border-yegna-border bg-background px-2 text-xs"
                    {...register(`hours.${index}.breakStartTime`)}
                  />
                  <span className="text-xs text-muted-foreground">to</span>
                  <input
                    type="time"
                    aria-label={`${entry.dayOfWeek} break end time`}
                    className="h-8 rounded-[10px] border border-yegna-border bg-background px-2 text-xs"
                    {...register(`hours.${index}.breakEndTime`)}
                  />
                </div>
              )}

              <FieldError
                message={errors.hours?.[index]?.closeTime?.message ?? errors.hours?.[index]?.breakEndTime?.message}
              />
            </div>
          );
        })}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending && <Spinner />}
        {isPending ? "Saving..." : "Save business hours"}
      </Button>
    </form>
  );
}