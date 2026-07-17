"use client";

import { Switch } from "@/components/ui/switch";
import { useUpdateNotificationPreferences } from "../hooks/useCustomerProfile";

interface NotificationPreferencesProps {
  preferences: Record<string, boolean>;
}

const PREFERENCE_LABELS: Record<string, string> = {
  email_marketing: "Email marketing",
  sms_promotions: "SMS promotions",
  app_push: "App push notifications",
  booking_reminders: "Booking reminders",
};

export function NotificationPreferences({ preferences }: NotificationPreferencesProps) {
  const { updatePreferences, isSaving } = useUpdateNotificationPreferences();

  const handleToggle = (key: string, checked: boolean) => {
    const newPrefs = { ...preferences, [key]: checked };
    updatePreferences({ notificationPreferences: newPrefs });
  };

  return (
    <div className="space-y-3">
      {Object.entries(PREFERENCE_LABELS).map(([key, label]) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-sm text-foreground">{label}</span>
          <Switch
            checked={preferences[key] ?? false}
            onCheckedChange={(checked) => handleToggle(key, checked)}
            disabled={isSaving}
          />
        </div>
      ))}
    </div>
  );
}