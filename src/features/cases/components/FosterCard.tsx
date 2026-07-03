import { Home, User, Calendar, MessageCircle } from "lucide-react";

interface FosterCardProps {
  caretaker: string;
  days: number;
}

/**
 * FosterCard — foster care info with avatar placeholder, days, and note.
 */
export function FosterCard({ caretaker, days }: FosterCardProps) {
  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)] transition-shadow hover:shadow-[0_8px_28px_rgba(108,92,231,0.12)]">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748] mb-4">
        <Home size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Temporary Foster Care
      </h3>

      <div className="flex items-center gap-4">
        {/* Avatar placeholder */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6C5CE7]/10 text-sm font-semibold text-[#6C5CE7]">
          {caretaker.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-[#2D3748]">
            <User size={13} strokeWidth={1.5} className="text-[#A788FA]" /> {caretaker}
          </p>
          <p className="flex items-center gap-1.5 mt-0.5 text-xs text-[#2D3748]/60">
            <Calendar size={12} strokeWidth={1.5} /> {days} day{days !== 1 ? "s" : ""} in foster care
          </p>
        </div>
      </div>

      {/* Foster note */}
      <div className="mt-4 flex gap-2 rounded-[10px] bg-[#A788FA]/5 p-3">
        <MessageCircle size={14} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#6C5CE7]" />
        <p className="text-xs text-[#2D3748]/70 italic leading-relaxed">
          &ldquo;The cat is adjusting well. Eating regularly and becoming more playful each day.&rdquo;
        </p>
      </div>
    </div>
  );
}
