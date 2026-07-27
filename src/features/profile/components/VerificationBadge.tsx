import { BadgeCheck, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MerchantProfile } from "../types/profile.types";

interface VerificationBadgeProps {
  status: MerchantProfile["verificationStatus"];
}

/**
 * Read-only display. `verificationStatus` is set server-side and there is
 * currently NO endpoint that transitions it away from "pending" — there's
 * no moderation/admin flow wired up yet (BACKEND_API_GUIDE.md §5.1, §11).
 * Don't add an edit control here; there's nothing on the backend for it
 * to call.
 */
export function VerificationBadge({ status }: VerificationBadgeProps) {
  const config = {
    verified: {
      icon: BadgeCheck,
      label: "Verified business",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    pending: {
      icon: Clock,
      label: "Verification pending",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    rejected: {
      icon: XCircle,
      label: "Verification rejected",
      className: "bg-red-50 text-red-700 border-red-200",
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        config.className,
      )}
    >
      <Icon className="size-3.5" />
      {config.label}
    </span>
  );
}