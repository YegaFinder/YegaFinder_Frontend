import { ModerationQueue } from "@/features/admin/components/ModerationQueue";

export default function ModerationQueuePage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Moderation Queue</h1>
        <p className="text-sm text-muted-foreground">Remove reviews that violate guidelines.</p>
      </header>
      <ModerationQueue />
    </div>
  );
}