import { History } from "lucide-react";
import { getPlatformActivities } from "@/lib/admin";
import { PlatformActivityClient } from "@/features/admin/components/PlatformActivityClient";

export const metadata = {
  title: "Platform Activity — TabbyAdmin",
};

export default async function AdminActivityPage() {
  const activities = await getPlatformActivities();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <History size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#2D3748]">Platform Activity Log</h1>
          <p className="text-xs text-[#2D3748]/60">Chronological timeline audit of all rescue operations and platform events</p>
        </div>
      </div>

      {/* Timeline filtering and logs */}
      <PlatformActivityClient initialActivities={activities} />
    </div>
  );
}
