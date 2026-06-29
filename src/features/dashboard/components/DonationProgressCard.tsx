import Link from "next/link";
import { HandCoins, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DonationProgressCardProps {
  id: string;
  title: string;
  location: string;
  goal: number;
  raised: number;
  donors: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

/**
 * DonationProgressCard — shows funding progress for an active fundraiser.
 * Reusable in dashboard, case feed, and case detail page.
 */
export function DonationProgressCard({ id, title, location, goal, raised, donors, severity }: DonationProgressCardProps) {
  const percent = Math.min(Math.round((raised / goal) * 100), 100);

  return (
    <Link
      href={`/cases/${id}`}
      className="block rounded-[14px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.06)] transition-all hover:shadow-[0_6px_24px_rgba(108,92,231,0.12)] hover:border-[#6C5CE7]/20"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#2D3748] truncate">{title}</p>
          <p className="mt-0.5 text-[11px] text-[#2D3748]/50">{location}</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#6C5CE7]/10 px-2 py-0.5 text-[10px] font-bold text-[#6C5CE7]">
          {percent}%
        </span>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <Progress value={percent} className="h-2 bg-[#A788FA]/15 [&>div]:bg-[#6C5CE7]" />
      </div>

      {/* Stats */}
      <div className="mt-2.5 flex items-center gap-4 text-[11px] text-[#2D3748]/60">
        <span className="flex items-center gap-1">
          <HandCoins size={12} strokeWidth={1.5} className="text-[#6C5CE7]" />
          ฿{raised.toLocaleString()} / ฿{goal.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} strokeWidth={1.5} />
          {donors} donors
        </span>
      </div>
    </Link>
  );
}
