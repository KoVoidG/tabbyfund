import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
}

/**
 * StatCard — displays a single metric with icon and optional trend.
 * Reusable across dashboards (community, vet, admin).
 */
export function StatCard({ icon: Icon, label, value, trend }: StatCardProps) {
  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_4px_20px_rgba(108,92,231,0.08)] transition-all hover:shadow-[0_6px_24px_rgba(108,92,231,0.12)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <Icon size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <p className="text-2xl font-bold text-[#2D3748]">{value}</p>
          <p className="text-xs text-[#2D3748]/60">{label}</p>
        </div>
      </div>
      {trend && (
        <p className="mt-2 text-[11px] font-medium text-emerald-600">{trend}</p>
      )}
    </div>
  );
}
