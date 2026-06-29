import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface DashboardSectionProps {
  title: string;
  viewAllHref?: string;
  children: React.ReactNode;
}

/**
 * DashboardSection — titled section wrapper with optional "View all" link.
 * Provides consistent spacing and headers across dashboard.
 */
export function DashboardSection({ title, viewAllHref, children }: DashboardSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-[#2D3748]">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-0.5 text-xs font-medium text-[#6C5CE7] hover:text-[#A788FA] transition-colors"
          >
            View all <ChevronRight size={14} strokeWidth={1.5} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
