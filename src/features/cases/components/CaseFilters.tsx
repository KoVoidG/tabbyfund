"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { CustomSelect } from "@/components/ui/CustomSelect";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "AWAITING_TRANSPORT", label: "Needs Transport" },
  { value: "FUNDING_OPEN", label: "Funding Open" },
  { value: "IN_TREATMENT", label: "In Treatment" },
  { value: "IN_FOSTER", label: "In Foster" },
  { value: "ADOPTED", label: "Adopted" },
  { value: "SHELTERED", label: "Sheltered" },
];

const severityOptions = [
  { value: "", label: "All Severity" },
  { value: "CRITICAL", label: "Critical" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const sortOptions = [
  { value: "newest", label: "Sort: Newest" },
  { value: "severity", label: "Sort: Severity" },
];

/**
 * CaseFilters — client component for search, status, severity, and sort controls.
 * Mobile-first: search bar full width, filters scroll horizontally on small screens.
 */
export function CaseFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const searchQuery = searchParams.get("search") ?? "";
  const statusFilter = searchParams.get("status") ?? "";
  const severityFilter = searchParams.get("severity") ?? "";
  const sortBy = searchParams.get("sort") ?? "newest";

  function updateQuery(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="space-y-3">
      {/* Search — full width */}
      <div className="relative">
        <Search size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A788FA]" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => updateQuery({ search: e.target.value })}
          placeholder="Search rescue cases..."
          className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white pl-10 pr-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15"
        />
      </div>

      {/* Filter row — flex-wrap to prevent dropdown clipping */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal size={14} strokeWidth={1.5} className="text-[#A788FA] shrink-0" />

        <CustomSelect
          value={statusFilter}
          onChange={(val) => updateQuery({ status: val })}
          options={statusOptions}
          widthClass="w-44"
        />

        <CustomSelect
          value={severityFilter}
          onChange={(val) => updateQuery({ severity: val })}
          options={severityOptions}
          widthClass="w-36"
        />

        <CustomSelect
          value={sortBy}
          onChange={(val) => updateQuery({ sort: val })}
          options={sortOptions}
          widthClass="w-36"
        />
      </div>
    </div>
  );
}
