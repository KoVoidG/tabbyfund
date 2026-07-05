import { CircleCheck, Camera, Plus } from "lucide-react";
import type { TreatmentUpdate } from "../mock-data";

interface TreatmentTimelineProps {
  updates: TreatmentUpdate[];
}

const statusColors = {
  examining: "bg-amber-500",
  treating: "bg-blue-500",
  recovering: "bg-cyan-500",
  recovered: "bg-emerald-500",
};

/**
 * TreatmentTimeline — vertical timeline of treatment updates.
 * Shows progress from examination to recovery.
 */
export function TreatmentTimeline({ updates }: TreatmentTimelineProps) {
  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#2D3748]">Treatment Progress</h3>
        <button className="flex items-center gap-1 rounded-[8px] bg-[#6C5CE7]/8 px-2.5 py-1.5 text-[10px] font-medium text-[#6C5CE7] hover:bg-[#6C5CE7]/15 transition">
          <Plus size={11} strokeWidth={1.5} /> Add Update
        </button>
      </div>

      <div className="space-y-0">
        {updates.map((update, i) => (
          <div key={update.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`h-3 w-3 rounded-full ${statusColors[update.status]}`} />
              {i < updates.length - 1 && <div className="w-0.5 flex-1 bg-[#A788FA]/15" />}
            </div>
            <div className="pb-5">
              <p className="text-[10px] font-semibold text-[#2D3748]/50">{update.date}</p>
              <p className="mt-0.5 text-xs text-[#2D3748]/80 leading-relaxed">{update.note}</p>
              {/* Photo placeholder */}
              <div className="mt-2 flex h-12 w-20 items-center justify-center rounded-[8px] border border-dashed border-[#A788FA]/20 bg-[#F7F7FB]">
                <Camera size={12} strokeWidth={1.5} className="text-[#A788FA]/40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
