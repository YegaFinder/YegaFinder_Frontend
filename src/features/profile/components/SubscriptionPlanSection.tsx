import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  { name: "Basic", price: "Free", features: ["Business profile", "Business hours", "Contact info"] },
  { name: "Pro", price: "Coming soon", features: ["Everything in Basic", "Promotions & coupons", "Staff accounts"] },
  { name: "Premium", price: "Coming soon", features: ["Everything in Pro", "Featured placement", "Priority support"] },
];

/**
 * `MerchantSubscription` and `SubscriptionPlan` exist only as empty
 * TypeORM entities — zero services/controllers/routes touch them
 * (BACKEND_API_GUIDE.md §11). There is nothing to subscribe TO yet, so
 * this is an informational display, not a real billing flow. Don't wire
 * the buttons to anything until that backend work is scoped.
 */
export function SubscriptionPlanSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {PLANS.map((plan, i) => (
        <div
          key={plan.name}
          className={cn(
            "flex flex-col gap-3 rounded-[16px] border p-5",
            i === 0 ? "border-yegna-primary bg-yegna-primary/5" : "border-yegna-border bg-background",
          )}
        >
          <div className="flex items-center gap-1.5">
            {i === 0 && <Sparkles className="size-4 text-yegna-primary" />}
            <h3 className="font-semibold">{plan.name}</h3>
          </div>
          <p className="text-2xl font-bold">{plan.price}</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-1.5">
                <Check className="mt-0.5 size-3.5 shrink-0 text-yegna-primary" />
                {f}
              </li>
            ))}
          </ul>
          <span className="mt-auto text-xs font-medium text-muted-foreground">
            {i === 0 ? "Your current plan" : "Not yet available"}
          </span>
        </div>
      ))}
    </div>
  );
}