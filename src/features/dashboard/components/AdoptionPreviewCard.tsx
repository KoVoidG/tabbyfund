import Link from "next/link";
import { Heart } from "lucide-react";

interface AdoptionPreviewCardProps {
  id: string;
  photo: string;
  name: string;
  personality: string;
  age: string;
  status: "OPEN" | "MATCHED" | "COMPLETED";
}

/**
 * AdoptionPreviewCard — shows a cat available for adoption.
 * Reusable in dashboard and adoption listing page.
 */
export function AdoptionPreviewCard({ id, photo, name, personality, age, status }: AdoptionPreviewCardProps) {
  return (
    <Link
      href={`/cases/${id}`}
      className="group overflow-hidden rounded-[14px] border border-[#A788FA]/15 bg-white shadow-[0_2px_12px_rgba(108,92,231,0.06)] transition-all hover:shadow-[0_6px_24px_rgba(108,92,231,0.12)] hover:border-[#6C5CE7]/20"
    >
      {/* Photo */}
      <div className="relative h-32 w-full overflow-hidden bg-[#F7F7FB]">
        <img src={photo} alt={name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        <div className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm">
          <Heart size={14} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
      </div>
      {/* Content */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#2D3748]">{name}</p>
          <span className="text-[10px] text-[#2D3748]/50">{age}</span>
        </div>
        <p className="mt-1 text-[11px] text-[#2D3748]/60 line-clamp-2">{personality}</p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-semibold text-pink-700">
          <Heart size={10} strokeWidth={1.5} /> Ready for Adoption
        </span>
      </div>
    </Link>
  );
}
