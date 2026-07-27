import { CheckCircle2, ShieldCheck, Tag, Users } from "lucide-react";
import type { MerchantProfile } from "../types/profile.types";

interface AnalyticsDashboardProps {
  profile?: MerchantProfile;
  staffCount: number;
  activePromotionsCount: number;
}

/**
 * There is no analytics/reporting endpoint anywhere in the backend (views,
 * orders, revenue, etc. don't exist as concepts at all in this API). Every
 * number here is computed from data the merchant profile genuinely has —
 * no fabricated metrics.
 */
export function AnalyticsDashboard({ profile, staffCount, activePromotionsCount }: AnalyticsDashboardProps) {
  const checklist: Array<[string, boolean]> = [
    ["Business name", !!profile?.businessName],
    ["Description", !!profile?.description],
    ["Logo", !!profile?.logoUrl],
    ["Banner", !!profile?.bannerUrl],
    ["Address", !!profile?.businessAddress],
    ["Contact phone", !!profile?.contactPhone],
    ["Contact email", !!profile?.contactEmail],
    ["Website", !!profile?.websiteUrl],
    ["Business hours set", (profile?.businessHours?.length ?? 0) > 0],
    ["At least one social link", Object.values(profile?.socialMedia ?? {}).some(Boolean)],
  ];
  const completedCount = checklist.filter(([, done]) => done).length;
  const strengthPct = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={ShieldCheck} label="Profile strength" value={`${strengthPct}%`} />
        <StatCard icon={Users} label="Team members" value={String(staffCount)} />
        <StatCard icon={Tag} label="Active promotions" value={String(activePromotionsCount)} />
      </div>

      <div className="rounded-[14px] border border-yegna-border bg-background p-5">
        <h3 className="mb-3 text-sm font-semibold">Profile checklist</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {checklist.map(([label, done]) => (
            <li key={label} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className={`size-4 shrink-0 ${done ? "text-yegna-primary" : "text-muted-foreground/30"}`} />
              <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof ShieldCheck; label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-yegna-border bg-background p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-yegna-navy">{value}</p>
    </div>
  );
}