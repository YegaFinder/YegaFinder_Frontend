import Link from "next/link";
import { ROUTES } from "@/constants/routes";

/**
 * Placeholder only — the real overview (User Table + Revenue Chart) is the
 * customer-side owner's Sprint 6 task per the plan. This exists so /admin
 * itself isn't a dead route now that the (admin) group has been scaffolded;
 * replace this file's contents when that work lands, don't delete the route.
 */
export default function AdminOverviewPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-sm text-muted-foreground">
        User table and revenue overview land here. For now, jump straight to a queue:
      </p>
      <div className="flex gap-3">
        <Link href={ROUTES.ADMIN_VERIFICATION_QUEUE} className="text-sm font-medium text-yegna-primary underline">
          Verification Queue
        </Link>
        <Link href={ROUTES.ADMIN_MODERATION_QUEUE} className="text-sm font-medium text-yegna-primary underline">
          Moderation Queue
        </Link>
      </div>
    </div>
  );
}