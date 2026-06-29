import { Activity, Zap, Users, FileText } from "lucide-react";

interface PlatformHealthCardProps {
  uptime: string;
  avgResponseMs: number;
  activeUsers24h: number;
  reportsToday: number;
}

/**
 * PlatformHealthCard — system health overview for admins.
 */
export function PlatformHealthCard({ uptime, avgResponseMs, activeUsers24h, reportsToday }: PlatformHealthCardProps) {
  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="text-sm font-semibold text-[#2D3748] mb-4">Platform Health</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
            <Activity size={14} strokeWidth={1.5} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#2D3748]">{uptime}</p>
            <p className="text-[9px] text-[#2D3748]/50">Uptime</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            <Zap size={14} strokeWidth={1.5} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#2D3748]">{avgResponseMs}ms</p>
            <p className="text-[9px] text-[#2D3748]/50">Avg Response</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6C5CE7]/10">
            <Users size={14} strokeWidth={1.5} className="text-[#6C5CE7]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#2D3748]">{activeUsers24h}</p>
            <p className="text-[9px] text-[#2D3748]/50">Active 24h</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
            <FileText size={14} strokeWidth={1.5} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#2D3748]">{reportsToday}</p>
            <p className="text-[9px] text-[#2D3748]/50">Reports Today</p>
          </div>
        </div>
      </div>
    </div>
  );
}
