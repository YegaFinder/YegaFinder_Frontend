"use client";

import { useState } from "react";

interface DateTimePickerProps {
  onSelect?: (date: string, time: string) => void;
}

// UI-only: no real availability data since that's backend-dependent.
// Time slots are a static placeholder set — swap for real availability
// once a booking/availability endpoint exists.
const PLACEHOLDER_SLOTS = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00",
];

function getNextDays(count: number): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

export function DateTimePicker({ onSelect }: DateTimePickerProps) {
  const days = getNextDays(7);
  const [selectedDate, setSelectedDate] = useState<string>(days[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onSelect?.(selectedDate, time);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-2">Date</label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((day) => {
            const label = new Date(day).toLocaleDateString(undefined, {
              weekday: "short",
              day: "numeric",
            });
            const isSelected = day === selectedDate;
            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDateChange(day)}
                className={`shrink-0 rounded-md border px-3 py-2 text-sm ${
                  isSelected
                    ? "border-primary bg-primary/5 font-medium"
                    : "border-border hover:bg-muted"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Time</label>
        <div className="grid grid-cols-4 gap-2">
          {PLACEHOLDER_SLOTS.map((time) => {
            const isSelected = time === selectedTime;
            return (
              <button
                key={time}
                type="button"
                onClick={() => handleTimeSelect(time)}
                className={`rounded-md border px-2 py-2 text-sm ${
                  isSelected
                    ? "border-primary bg-primary/5 font-medium"
                    : "border-border hover:bg-muted"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
