"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FieldError, Spinner } from "@/components/shared/form-feedback";

import {
  businessHoursSchema,
  buildDefaultBusinessHours,
  type BusinessHoursFormValues,
} from "../schemas/merchant-profile.schema";
import type { BusinessHours } from "../types/profile.types";

interface BusinessHoursEditorProps {
  businessHours?: BusinessHours[];
  onSubmit: (values: BusinessHoursFormValues) => void | Promise<void>;
  isSaving: boolean;
  disabled?: boolean;
}

export function BusinessHoursEditor({ businessHours, onSubmit, isSaving, disabled }: BusinessHoursEditorProps) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<BusinessHoursFormValues>({
    resolver: zodResolver(businessHoursSchema),
    defaultValues: { businessHours: buildDefaultBusinessHours(businessHours) },
  });

  const { fields } = useFieldArray({ control, name: "businessHours" });

  // Whether the "break" row is shown per day — kept as separate UI
  // state because an empty string ("") is a legitimate "not filled in
  // yet, but visible" state, and therefore falsy-unsafe to derive from.
  const [breaksShown, setBreaksShown] = useState<boolean[]>(() =>
    buildDefaultBusinessHours(businessHours).map((d) => !!(d.breakStartTime || d.breakEndTime)),
  );

  useEffect(() => {
    const defaults = buildDefaultBusinessHours(businessHours);
    reset({ businessHours: defaults });
    setBreaksShown(defaults.map((d) => !!(d.breakStartTime || d.breakEndTime)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessHours]);

  const days = watch("businessHours");

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-4" noValidate>
      {disabled && (
        <p className="text-sm text-muted-foreground">
          Save your business details first — operating hours can be set once your profile exists.
        </p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const day = days?.[index];
          const isClosed = !!day?.isClosed;
          const is24Hours = !!day?.is24Hours;
          const timesDisabled = disabled || isClosed || is24Hours;
          const dayErrors = errors.businessHours?.[index];
          const hasBreak = breaksShown[index];

          return (
            <div key={field.id} className="rounded-2xl border border-yegna-border p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-medium">{field.dayOfWeek}</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={isClosed}
                      disabled={disabled}
                      aria-label={`Mark ${field.dayOfWeek} closed`}
                      onCheckedChange={(checked) => {
                        setValue(`businessHours.${index}.isClosed`, checked, { shouldDirty: true });
                        if (checked) setValue(`businessHours.${index}.is24Hours`, false, { shouldDirty: true });
                      }}
                    />
                    Closed
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={is24Hours}
                      disabled={disabled || isClosed}
                      aria-label={`Mark ${field.dayOfWeek} open 24 hours`}
                      onCheckedChange={(checked) => {
                        setValue(`businessHours.${index}.is24Hours`, checked, { shouldDirty: true });
                        if (checked) setValue(`businessHours.${index}.isClosed`, false, { shouldDirty: true });
                      }}
                    />
                    Open 24 hours
                  </label>
                </div>
              </div>

              {!isClosed && !is24Hours && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor={`open-${index}`}>Opens</Label>
                      <Input
                        id={`open-${index}`}
                        type="time"
                        disabled={timesDisabled}
                        aria-invalid={!!dayErrors?.openTime}
                        {...register(`businessHours.${index}.openTime`)}
                      />
                      <FieldError message={dayErrors?.openTime?.message} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`close-${index}`}>Closes</Label>
                      <Input
                        id={`close-${index}`}
                        type="time"
                        disabled={timesDisabled}
                        aria-invalid={!!dayErrors?.closeTime}
                        {...register(`businessHours.${index}.closeTime`)}
                      />
                      <FieldError message={dayErrors?.closeTime?.message} />
                    </div>
                  </div>

                  {hasBreak ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label htmlFor={`break-start-${index}`}>Break starts</Label>
                        <Input
                          id={`break-start-${index}`}
                          type="time"
                          disabled={timesDisabled}
                          aria-invalid={!!dayErrors?.breakStartTime}
                          {...register(`businessHours.${index}.breakStartTime`)}
                        />
                        <FieldError message={dayErrors?.breakStartTime?.message} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`break-end-${index}`}>Break ends</Label>
                        <Input
                          id={`break-end-${index}`}
                          type="time"
                          disabled={timesDisabled}
                          aria-invalid={!!dayErrors?.breakEndTime}
                          {...register(`businessHours.${index}.breakEndTime`)}
                        />
                        <FieldError message={dayErrors?.breakEndTime?.message} />
                      </div>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-destructive w-fit"
                        onClick={() => {
                          setValue(`businessHours.${index}.breakStartTime`, "", { shouldDirty: true });
                          setValue(`businessHours.${index}.breakEndTime`, "", { shouldDirty: true });
                          setBreaksShown((prev) => prev.map((v, i) => (i === index ? false : v)));
                        }}
                      >
                        Remove break
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="text-xs text-yegna-primary hover:underline w-fit disabled:opacity-50"
                      disabled={timesDisabled}
                      onClick={() => setBreaksShown((prev) => prev.map((v, i) => (i === index ? true : v)))}
                    >
                      + Add break
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <Button type="submit" disabled={disabled || isSaving || !isDirty}>
        {isSaving && <Spinner />}
        {isSaving ? "Saving..." : "Save business hours"}
      </Button>
    </form>
  );
}