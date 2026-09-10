interface VerificationBadgeProps {
  status: string;
  size?: "sm" | "md";
}

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
};

export function VerificationBadge({ status, size = "md" }: VerificationBadgeProps) {
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const config = STATUS_CONFIG[status];

  // Unrecognized or "unverified" status: render nothing rather than guess.
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
