import { VerificationQueue } from "@/features/admin/components/VerificationQueue";

export default function VerificationQueuePage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Verification Queue</h1>
        <p className="text-sm text-muted-foreground">Review, approve, or reject business listings.</p>
      </header>
      <VerificationQueue />
    </div>
  );
}