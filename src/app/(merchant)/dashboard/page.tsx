import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function MerchantDashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="text-muted-foreground text-lg">
        The dashboard overview lands in a later sprint.
      </p>
      <Button asChild>
        <Link href={ROUTES.MERCHANT_PROFILE}>Go to Business Profile</Link>
      </Button>
    </div>
  );
}