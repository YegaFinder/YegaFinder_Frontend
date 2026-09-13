interface VerificationBadgeProps {
  status: string;
  size?: "sm" | "md";
}

// Backend entity (business.entity.ts) types this as
// 'pending' | 'verified' | 'rejected' — a TS-level annotation, not a DB
// CHECK constraint (column is varchar), so treat this as documented
// intent rather than a live-verified guarantee. Unrecognized values
// still render nothing rather than error.
const STATUS_CONFIG: Record<string, { label: string; icon: string; classes: string }> = {
  verified: {
    label: "Verified",
    icon: "✓",
    classes: "bg-green-100 text-green-800",
  },
  pending: {
    label: "Verification pending",
    icon: "⏳",
    classes: "bg-yellow-100 text-yellow-800",
  },
  rejected: {
    label: "Verification rejected",
    icon: "✕",
    classes: "bg-red-100 text-red-800",
  },
};

export function VerificationBadge({ status, size = "md" }: VerificationBadgeProps) {
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const config = STATUS_CONFIG[status];

  if (!config) {
    return null;
  }

  return (
    <span
      className={`${textSize} ${config.classes} inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium`}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
