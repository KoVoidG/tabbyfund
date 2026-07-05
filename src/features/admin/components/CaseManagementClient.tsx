"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Stethoscope,
  HandCoins,
  Calendar,
  User,
  Eye,
  History,
  X,
} from "lucide-react";
import type { AdminCaseItem } from "@/lib/admin";
import { formatDistanceToNow } from "date-fns";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { CustomSelect } from "@/components/ui/CustomSelect";

interface CaseManagementClientProps {
  initialCases: AdminCaseItem[];
}

function CaseManagementContent({ initialCases }: CaseManagementClientProps) {
  const searchParams = useSearchParams();
  const initStatus = searchParams.get("status") || "all";
  const initSeverity = searchParams.get("severity") || "all";
  const initFunding = searchParams.get("funding") || "all";
  const initOutcome = searchParams.get("outcome") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(initStatus);
  const [selectedSeverity, setSelectedSeverity] = useState(initSeverity);
  const [selectedVet, setSelectedVet] = useState("all");
  const [selectedFunding, setSelectedFunding] = useState(initFunding);
  const [selectedOutcome, setSelectedOutcome] = useState(initOutcome);

  // Dynamic list of vets
  const uniqueVets = Array.from(
    new Set(
      initialCases
        .map((c) => c.assigned_vet?.display_name)
        .filter((name): name is string => !!name)
    )
  );

  // Helper to map status display
  function getStatusStyle(status: string) {
    switch (status) {
      case "REPORTED":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "TRIAGED":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "FUNDING_OPEN":
        return "bg-amber-50 text-amber-700 border-amber-100 animate-pulse";
      case "FUNDED":
      case "IN_TREATMENT":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "TREATED":
      case "FUNDS_RELEASED":
        return "bg-purple-50 text-purple-700 border-purple-100";
      case "ADOPTED":
        return "bg-pink-50 text-pink-700 border-pink-100";
      case "DECEASED":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  }

  function getSeverityStyle(severity: string | null) {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500 text-white";
      case "HIGH":
        return "bg-orange-500 text-white";
      case "MEDIUM":
        return "bg-amber-500 text-white";
      case "LOW":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  }

  // Filtering Logic
  const filteredCases = initialCases.filter((c) => {
    // 1. Text Search matching title (ai_condition) or description
    const titleMatch = (c.ai_condition || "").toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (c.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    if (searchQuery && !titleMatch && !descMatch) return false;

    // 2. Status filter (with active/closed/foster_needed helper values)
    if (selectedStatus !== "all") {
      const isTerminal = ["ADOPTED", "SHELTERED", "REUNITED", "CANCELLED", "LOST_CONTACT", "DECEASED"].includes(c.status);
      if (selectedStatus === "active" && isTerminal) return false;
      if (selectedStatus === "closed" && !isTerminal) return false;
      if (selectedStatus === "foster_needed" && c.status !== "TREATED" && c.status !== "FUNDS_RELEASED") return false;
      if (selectedStatus !== "active" && selectedStatus !== "closed" && selectedStatus !== "foster_needed" && c.status !== selectedStatus) return false;
    }

    // 3. Severity filter
    if (selectedSeverity !== "all" && c.ai_severity !== selectedSeverity) return false;

    // 4. Assigned Vet filter
    if (selectedVet !== "all" && c.assigned_vet?.display_name !== selectedVet) return false;

    // 5. Funding Status filter
    if (selectedFunding !== "all") {
      const goal = c.funding?.goal ?? 0;
      const raised = c.funding?.total_raised ?? 0;

      if (selectedFunding === "pending_quote" && goal > 0) return false;
      if (selectedFunding === "funding_open" && (goal === 0 || raised >= goal || c.status !== "FUNDING_OPEN")) return false;
      if (selectedFunding === "fully_funded" && (goal === 0 || raised < goal)) return false;
    }

    // 6. Outcome filter
    if (selectedOutcome !== "all") {
      if (selectedOutcome === "Adopted" && c.status !== "ADOPTED") return false;
      if (selectedOutcome === "Sheltered" && c.status !== "SHELTERED") return false;
      if (selectedOutcome === "Deceased" && c.status !== "DECEASED") return false;
      if (selectedOutcome === "Recovered" && c.status !== "TREATED" && c.status !== "FUNDS_RELEASED") return false;
    }

    return true;
  });

  const activeFiltersCount =
    (selectedStatus !== "all" ? 1 : 0) +
    (selectedSeverity !== "all" ? 1 : 0) +
    (selectedVet !== "all" ? 1 : 0) +
    (selectedFunding !== "all" ? 1 : 0) +
    (selectedOutcome !== "all" ? 1 : 0);

  function resetFilters() {
    setSelectedStatus("all");
    setSelectedSeverity("all");
    setSelectedVet("all");
    setSelectedFunding("all");
    setSelectedOutcome("all");
    setSearchQuery("");
  }

  // Quick Filter Handler
  function handleQuickFilter(statusType: string) {
    resetFilters();
    setSelectedStatus(statusType);
  }

  return (
    <div className="space-y-6">
      {/* Quick Filter Chips (Horizontally Scrollable) */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: "all", label: "All Rescues" },
          { id: "active", label: "Active Rescues" },
          { id: "closed", label: "Closed Cases" },
          { id: "FUNDING_OPEN", label: "Funding Open" },
          { id: "IN_TREATMENT", label: "In Treatment" },
          { id: "foster_needed", label: "Foster Needed" },
          { id: "ADOPTED", label: "Adopted" },
        ].map((chip) => {
          const isActive = selectedStatus === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => handleQuickFilter(chip.id)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#6C5CE7] text-white border-transparent shadow-sm"
                  : "bg-white border-[#A788FA]/15 text-[#2D3748]/60 hover:border-[#6C5CE7]/30 hover:text-[#6C5CE7]"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Search and Filters Header */}
      <div className="rounded-[20px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.04)] space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#2D3748]/40" />
          <input
            type="text"
            placeholder="Search cases by condition or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[12px] border border-[#A788FA]/15 pl-10 pr-4 py-2.5 text-sm focus:border-[#6C5CE7] focus:outline-none placeholder:text-[#2D3748]/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3.5 text-[#2D3748]/40 hover:text-[#2D3748]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters dropdowns row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status Select */}
          <div className="flex flex-col gap-1 min-w-[120px] flex-1 sm:flex-initial">
            <span className="text-[10px] font-bold text-[#2D3748]/55 uppercase tracking-wider">Status Detail</span>
            <CustomSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: "all", label: "All Rescues" },
                { value: "active", label: "Active Rescues" },
                { value: "closed", label: "Closed Cases" },
                { value: "foster_needed", label: "Foster Needed" },
                { value: "REPORTED", label: "Reported" },
                { value: "TRIAGED", label: "Triaged" },
                { value: "AWAITING_TRANSPORT", label: "Awaiting Transport" },
                { value: "IN_TRANSIT", label: "In Transit" },
                { value: "AT_VET", label: "At Vet" },
                { value: "FUNDING_OPEN", label: "Funding Open" },
                { value: "FUNDED", label: "Funded" },
                { value: "IN_TREATMENT", label: "In Treatment" },
                { value: "TREATED", label: "Treated" },
                { value: "ADOPTED", label: "Adopted" },
                { value: "DECEASED", label: "Deceased" },
              ]}
              widthClass="w-52"
            />
          </div>

          {/* Severity */}
          <div className="flex flex-col gap-1 min-w-[120px] flex-1 sm:flex-initial">
            <span className="text-[10px] font-bold text-[#2D3748]/55 uppercase tracking-wider">Severity</span>
            <CustomSelect
              value={selectedSeverity}
              onChange={setSelectedSeverity}
              options={[
                { value: "all", label: "All Severities" },
                { value: "LOW", label: "Low" },
                { value: "MEDIUM", label: "Medium" },
                { value: "HIGH", label: "High" },
                { value: "CRITICAL", label: "Critical" },
              ]}
              widthClass="w-36"
            />
          </div>

          {/* Assigned Vet */}
          <div className="flex flex-col gap-1 min-w-[130px] flex-1 sm:flex-initial">
            <span className="text-[10px] font-bold text-[#2D3748]/55 uppercase tracking-wider">Assigned Vet</span>
            <CustomSelect
              value={selectedVet}
              onChange={setSelectedVet}
              options={[
                { value: "all", label: "All Vets" },
                ...uniqueVets.map((name) => ({ value: name, label: name })),
              ]}
              widthClass="w-44"
            />
          </div>

          {/* Funding Status */}
          <div className="flex flex-col gap-1 min-w-[130px] flex-1 sm:flex-initial">
            <span className="text-[10px] font-bold text-[#2D3748]/55 uppercase tracking-wider">Funding Status</span>
            <CustomSelect
              value={selectedFunding}
              onChange={setSelectedFunding}
              options={[
                { value: "all", label: "All Funding States" },
                { value: "pending_quote", label: "Pending Quote" },
                { value: "funding_open", label: "Funding Open" },
                { value: "fully_funded", label: "Fully Funded" },
              ]}
              widthClass="w-44"
            />
          </div>

          {/* Outcome */}
          <div className="flex flex-col gap-1 min-w-[130px] flex-1 sm:flex-initial">
            <span className="text-[10px] font-bold text-[#2D3748]/55 uppercase tracking-wider">Outcome</span>
            <CustomSelect
              value={selectedOutcome}
              onChange={setSelectedOutcome}
              options={[
                { value: "all", label: "All Outcomes" },
                { value: "Recovered", label: "Recovered" },
                { value: "Adopted", label: "Adopted" },
                { value: "Sheltered", label: "Sheltered" },
                { value: "Deceased", label: "Deceased" },
              ]}
              widthClass="w-44"
            />
          </div>

          {/* Reset Filters */}
          {(activeFiltersCount > 0 || searchQuery) && (
            <button
              onClick={resetFilters}
              className="self-end flex items-center gap-1.5 rounded-[10px] border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
            >
              <X size={12} /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Case Cards */}
      <div className="flex items-center justify-between text-xs text-[#2D3748]/60 px-1">
        <p>Showing {filteredCases.length} of {initialCases.length} cases</p>
      </div>

      {filteredCases.length === 0 ? (
        <div className="rounded-[20px] border border-[#A788FA]/10 bg-white p-12 text-center flex flex-col items-center gap-3">
          <TabbyMascot variant="wave" size="lg" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#2D3748]">No rescues match your search criteria</p>
            <p className="text-xs text-[#2D3748]/50 max-w-sm mx-auto leading-relaxed">
              We couldn&apos;t find any cases matching these filter settings. Try adjusting the dropdowns or typing different search words!
            </p>
          </div>
          {(activeFiltersCount > 0 || searchQuery) && (
            <button
              onClick={resetFilters}
              className="mt-2 rounded-[10px] bg-[#6C5CE7] text-white px-4 py-2 text-xs font-semibold hover:bg-[#6C5CE7]/90 transition"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((c) => {
            const hasFunding = c.funding && c.funding.goal > 0;
            const progress = hasFunding ? Math.min(100, Math.round((c.funding!.total_raised / c.funding!.goal) * 100)) : 0;

            return (
              <div
                key={c.id}
                className="flex flex-col justify-between rounded-[18px] border border-[#A788FA]/15 bg-white overflow-hidden shadow-[0_2px_12px_rgba(108,92,231,0.03)] hover:shadow-[0_4px_20px_rgba(108,92,231,0.07)] transition-all"
              >
                {/* Image and Header */}
                <div className="relative h-44 w-full bg-slate-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.photo_url}
                    alt={c.ai_condition || "Rescue case"}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getSeverityStyle(c.ai_severity)}`}>
                      {c.ai_severity || "UNKNOWN"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold bg-white shadow-sm ${getStatusStyle(c.status)}`}>
                      {c.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-[#2D3748] truncate">
                      {c.ai_condition || "Unknown Condition"}
                    </h3>
                    <p className="text-xs text-[#2D3748]/60 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="my-3 h-px bg-[#A788FA]/10" />

                  {/* Metadata fields */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-[#2D3748]/60">
                    <div className="flex items-center gap-1 min-w-0">
                      <User size={12} className="text-[#A788FA]" />
                      <span className="truncate">Rep: {c.reporter?.display_name || "Community"}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      <Calendar size={12} className="text-[#A788FA]" />
                      <span>{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0 col-span-2 mt-1">
                      <Stethoscope size={12} className="text-[#A788FA]" />
                      <span className="truncate">
                        Vet: {c.assigned_vet?.display_name ? `${c.assigned_vet.display_name} (${c.assigned_vet.clinic_name || "Clinic"})` : "None"}
                      </span>
                    </div>
                  </div>

                  {/* Funding progress */}
                  {hasFunding && (
                    <div className="space-y-1 mt-3">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-[#2D3748]">
                        <span className="flex items-center gap-1 text-emerald-600">
                          <HandCoins size={11} /> ฿{c.funding!.total_raised} raised
                        </span>
                        <span className="text-[#2D3748]/45">Goal: ฿{c.funding!.goal}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 border-t border-[#A788FA]/10 bg-[#F7F7FB]">
                  <Link
                    href={`/cases/${c.id}`}
                    className="flex items-center justify-center gap-1 py-3 text-[11px] font-semibold text-[#2D3748]/70 hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7] transition border-r border-[#A788FA]/10"
                  >
                    <Eye size={12} /> View Case
                  </Link>
                  <Link
                    href={`/cases/${c.id}#timeline`}
                    className="flex items-center justify-center gap-1 py-3 text-[11px] font-semibold text-[#2D3748]/70 hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7] transition"
                  >
                    <History size={12} /> View Timeline
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CaseManagementClient({ initialCases }: CaseManagementClientProps) {
  return (
    <Suspense fallback={<div className="text-center py-12 text-xs text-[#2D3748]/40">Loading filter criteria...</div>}>
      <CaseManagementContent initialCases={initialCases} />
    </Suspense>
  );
}
