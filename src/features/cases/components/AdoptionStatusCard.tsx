import { Heart, CircleCheck, PawPrint, ShieldCheck, Sparkles } from "lucide-react";

interface AdoptionStatusCardProps {
  status: "OPEN" | "MATCHED" | "COMPLETED" | "CLOSED";
  personality?: string;
  medicalNotes?: string;
  photo?: string;
}

/**
 * AdoptionStatusCard — Tinder-style adoption preview card.
 * Shows personality tags, health tags, adoption readiness, and CTA.
 */
export function AdoptionStatusCard({ status, personality, medicalNotes, photo }: AdoptionStatusCardProps) {
  // Split personality into tags
  const personalityTags = personality
    ? personality.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const healthTags = medicalNotes
    ? medicalNotes.split(".").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#A788FA]/15 bg-white shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      {/* Photo area */}
      <div className="relative h-48 bg-gradient-to-br from-[#F7F7FB] to-[#A788FA]/10 flex items-center justify-center">
        {photo ? (
          <img src={photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <PawPrint size={48} strokeWidth={1} className="text-[#A788FA]/25" />
        )}
        {/* Status overlay */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            status === "COMPLETED" ? "bg-emerald-500 text-white" :
            status === "MATCHED" ? "bg-purple-500 text-white" :
            status === "CLOSED" ? "bg-gray-500 text-white" :
            "bg-pink-500 text-white"
          }`}>
            {status === "COMPLETED" && <><CircleCheck size={11} strokeWidth={2} /> Adopted!</>}
            {status === "MATCHED" && <><Heart size={11} strokeWidth={2} /> Matched</>}
            {status === "OPEN" && <><Sparkles size={11} strokeWidth={2} /> Ready</>}
            {status === "CLOSED" && <><CircleCheck size={11} strokeWidth={2} /> Closed</>}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748] mb-3">
          <Heart size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Adoption
        </h3>

        {/* Personality tags */}
        {personalityTags.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-medium text-[#2D3748]/50 mb-1.5">Personality</p>
            <div className="flex flex-wrap gap-1.5">
              {personalityTags.map((tag, i) => (
                <span key={i} className="rounded-full bg-[#6C5CE7]/8 px-2.5 py-0.5 text-[11px] font-medium text-[#6C5CE7]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Health tags */}
        {healthTags.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-medium text-[#2D3748]/50 mb-1.5">Health</p>
            <div className="flex flex-wrap gap-1.5">
              {healthTags.map((tag, i) => (
                <span key={i} className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                  <ShieldCheck size={10} strokeWidth={1.5} /> {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        {status === "OPEN" && (
          <button className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#6C5CE7] to-[#A788FA] text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]">
            <Heart size={16} strokeWidth={1.5} /> Request Adoption
          </button>
        )}
      </div>
    </div>
  );
}
