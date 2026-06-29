import { Clock, HeartPulse, FileText, CircleCheck } from "lucide-react";

interface VetDashboardStatsProps {
  waiting: number;
  inTreatment: number;
  quotesSent: number;
  completedToday: number;
}

/**
 * VetDashboardStats — top-level stats row for the vet portal.
 */
export function VetDashboardStats({ waiting, inTreatment, quotesSent, completedToday }: VetDashboardStatsProps) {
  const stats = [
    { icon: Clock, label: "Waiting", value: waiting, color: "text-orange-600 bg-orange-100" },
    { icon: HeartPulse, label: "In Treatment", value: inTreatment, color: "text-blue-600 bg-blue-100" },
    { icon: FileText, label: "Quotes Sent", value: quotesSent, color: "text-[#6C5CE7] bg-[#6C5CE7]/10" },
    { icon: CircleCheck, label: "Completed", value: completedToday, color: "text-emerald-600 bg-emerald-100" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-[14px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.06)]">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon size={18} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xl font-bold text-[#2D3748]">{s.value}</p>
              <p className="text-[10px] text-[#2D3748]/60">{s.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
