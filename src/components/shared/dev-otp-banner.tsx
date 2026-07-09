"use client";

import { useAuthStore } from "@/store/auth-store";

/**
 * TEST_MODE-only helper. While the backend runs with TEST_MODE=true
 * (transactional email / Resend disabled), the OTP endpoints echo the
 * code back in the response body instead of only mailing it — see
 * auth.api.ts. This renders that code directly in the UI so the auth
 * flow isn't blocked on email delivery.
 *
 * Renders nothing when `devOtp` is unset — i.e. in production, or any
 * time the backend didn't hand back a code. Safe to drop into any auth
 * screen unconditionally.
 *
 * Remove this component (and the `devOtp` field on the auth store)
 * once SMTP/Resend is confirmed working and TEST_MODE stays off.
 */
export function DevOtpBanner({ onUse }: { onUse?: (otp: string) => void }) {
  const devOtp = useAuthStore((state) => state.devOtp);

  if (!devOtp) return null;

  return (
    <div className="rounded-[14px] border border-dashed border-yegna-primary/40 bg-yegna-primary/5 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-yegna-primary">
        Test mode — email delivery is disabled
      </p>
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Your code is{" "}
          <span className="font-mono text-base font-bold tracking-[0.2em] text-foreground">
            {devOtp}
          </span>
        </p>
        {onUse && (
          <button
            type="button"
            onClick={() => onUse(devOtp)}
            className="shrink-0 text-xs font-medium text-yegna-primary hover:underline"
          >
            Fill in
          </button>
        )}
      </div>
    </div>
  );
}
