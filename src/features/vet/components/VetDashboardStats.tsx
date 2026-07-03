import { Clock, HeartPulse, FileText, CircleCheck } from "lucide-react";

interface VetDashboardStatsProps {
  waiting: number;
  inTreatment: number;
  completed: number;
  releasedEarnings: number;
}

/**
 * VetDashboardStats — top-level stats row for the vet portal.
 */
export function VetDashboardStats({ waiting, inTreatment, completed, releasedEarnings }: VetDashboardStatsProps) {
  const stats = [
    { icon: Clock, label: "Patients Waiting", value: waiting, color: "text-orange-600 bg-orange-100", desc: "Cases currently waiting for examination." },
    { icon: HeartPulse, label: "In Treatment", value: inTreatment, color: "text-blue-600 bg-blue-100", desc: "Cases currently being treated." },
    { icon: CircleCheck, label: "Completed Treatments", value: completed, color: "text-emerald-600 bg-emerald-100", desc: "Recovered + confirmed treatments." },
    { icon: FileText, label: "Released Earnings", value: `฿${releasedEarnings.toLocaleString()}`, color: "text-[#6C5CE7] bg-[#6C5CE7]/10", desc: "Total amount successfully released from escrow." },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.06)] flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon size={20} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xl font-bold text-[#2D3748] tracking-tight">{s.value}</p>
              <p className="text-[10px] font-bold text-[#2D3748]/75 tracking-wide uppercase mt-0.5">{s.label}</p>
            </div>
          </div>
          <p className="text-[10px] text-[#2D3748]/45 mt-3 leading-normal">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}
