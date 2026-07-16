"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUpdateNotificationPreferences } from "../hooks/useCustomerProfile";

interface NotificationPreferencesProps {
  preferences: Record<string, boolean>;
}

/**
 * `notificationPreferences` on `CustomerProfile` (main) is a loose
 * Record<string, boolean> — the backend hasn't published a fixed key
 * list, so these four keys are a best guess (same guess the branch had
 * before), not a confirmed contract. If the backend uses different key
 * names, only this list needs to change.
 */
const TOGGLES: { key: string; label: string; hint: string }[] = [
  {
    key: "emailNotifications",
    label: "Email notifications",
    hint: "Booking confirmations and account updates",
  },
  {
    key: "smsNotifications",
    label: "SMS notifications",
    hint: "Time-sensitive alerts sent to your phone",
  },
  {
    key: "pushNotifications",
    label: "Push notifications",
    hint: "Alerts on this device via the app",
  },
  {
    key: "promotionalEmails",
    label: "Promotional emails",
    hint: "Offers and news from merchants you follow",
  },
];

export function NotificationPreferences({ preferences }: NotificationPreferencesProps) {
  const [local, setLocal] = useState(preferences);
  const { updatePreferences, isSaving } = useUpdateNotificationPreferences();

  async function handleToggle(key: string) {
    const next = { ...local, [key]: !local[key] };
    setLocal(next); // optimistic
    const updated = await updatePreferences({ [key]: next[key] });
    if (!updated) setLocal(local); // revert on failure
  }

  return (
    <div className="space-y-4">
      {TOGGLES.map(({ key, label, hint }) => (
        <div key={key} className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={!!local[key]}
            disabled={isSaving}
            onClick={() => handleToggle(key)}
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50",
              local[key] ? "bg-yegna-primary" : "bg-yegna-border",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform",
                local[key] && "translate-x-5",
              )}
            />
          </button>
        </div>
      ))}
    </div>
  );
}
