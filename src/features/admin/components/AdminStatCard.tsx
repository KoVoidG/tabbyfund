import type { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
}

/**
 * AdminStatCard — single metric card for admin dashboard.
 */
export function AdminStatCard({ icon: Icon, label, value, color }: AdminStatCardProps) {
  return (
    <div className="rounded-[14px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.06)] transition-shadow hover:shadow-[0_6px_20px_rgba(108,92,231,0.1)]">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xl font-bold text-[#2D3748]">{value}</p>
          <p className="text-[10px] text-[#2D3748]/60">{label}</p>
        </div>
      </div>
    </div>
  );
}
