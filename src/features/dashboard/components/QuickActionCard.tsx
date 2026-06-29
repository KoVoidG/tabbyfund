import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  href: string;
  description: string;
}

/**
 * QuickActionCard — single action button for the dashboard.
 * Reusable CTA card that links to a feature.
 */
export function QuickActionCard({ icon: Icon, label, href, description }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 rounded-[16px] border border-[#A788FA]/15 bg-white p-4 text-center shadow-[0_2px_12px_rgba(108,92,231,0.06)] transition-all hover:border-[#6C5CE7]/30 hover:shadow-[0_6px_24px_rgba(108,92,231,0.12)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6C5CE7]/8 transition-colors group-hover:bg-[#6C5CE7]/15">
        <Icon size={22} strokeWidth={1.5} className="text-[#6C5CE7]" />
      </div>
      <p className="text-sm font-semibold text-[#2D3748]">{label}</p>
      <p className="text-[11px] text-[#2D3748]/50 leading-tight">{description}</p>
    </Link>
  );
}
