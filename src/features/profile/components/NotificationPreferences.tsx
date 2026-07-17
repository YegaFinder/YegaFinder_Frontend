"use client";

import { Switch } from "@/components/ui/switch";
import { useUpdateNotificationPreferences } from "../hooks/useCustomerProfile";

interface NotificationPreferencesProps {
  preferences: Record<string, boolean> | null | undefined;
}

const PREFERENCE_LABELS: Record<string, string> = {
  email_marketing: "Email marketing",
  sms_promotions: "SMS promotions",
  app_push: "App push notifications",
  booking_reminders: "Booking reminders",
};

export function NotificationPreferences({ preferences }: NotificationPreferencesProps) {
  const { updatePreferences, isSaving } = useUpdateNotificationPreferences();

  // The backend can return a profile with notificationPreferences unset
  // (null/undefined) — e.g. right after profile creation, before any
  // toggle has ever been saved. Fall back to {} so this renders instead
  // of throwing "Cannot read properties of undefined" on first load.
  const safePreferences = preferences ?? {};

  const handleToggle = (key: string, checked: boolean) => {
    const newPrefs = { ...safePreferences, [key]: checked };
    updatePreferences({ notificationPreferences: newPrefs });
  };

  return (
    <div className="space-y-3">
      {Object.entries(PREFERENCE_LABELS).map(([key, label]) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-sm text-foreground">{label}</span>
          <Switch
            checked={safePreferences[key] ?? false}
            onCheckedChange={(checked: boolean) => handleToggle(key, checked)}
            disabled={isSaving}
          />
        </div>
      ))}
    </div>
  );
}