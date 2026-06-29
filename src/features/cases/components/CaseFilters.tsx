"use client";

import { Search } from "lucide-react";

/**
 * CaseFilters — client component for search, status, severity, and sort controls.
 * Placeholder filters for demo — will be wired to real query params later.
 */
export function CaseFilters() {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A788FA]" />
        <input
          type="search"
          placeholder="Search rescue cases..."
          className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white pl-10 pr-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15"
        />
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        <select className="h-9 rounded-[10px] border border-[#A788FA]/20 bg-white px-3 text-xs text-[#2D3748] focus:border-[#6C5CE7] focus:outline-none">
          <option value="">All Statuses</option>
          <option value="AWAITING_TRANSPORT">Needs Transport</option>
          <option value="FUNDING_OPEN">Funding Open</option>
          <option value="IN_TREATMENT">In Treatment</option>
          <option value="IN_FOSTER">In Foster</option>
          <option value="ADOPTED">Adopted</option>
        </select>
        <select className="h-9 rounded-[10px] border border-[#A788FA]/20 bg-white px-3 text-xs text-[#2D3748] focus:border-[#6C5CE7] focus:outline-none">
          <option value="">All Severity</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select className="h-9 rounded-[10px] border border-[#A788FA]/20 bg-white px-3 text-xs text-[#2D3748] focus:border-[#6C5CE7] focus:outline-none">
          <option value="severity">Sort: Severity</option>
          <option value="newest">Sort: Newest</option>
          <option value="funding">Sort: Funding %</option>
        </select>
      </div>
    </div>
  );
}
