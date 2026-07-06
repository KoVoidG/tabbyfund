"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  ShieldAlert,
  Sparkles,
  User,
  AlertCircle,
} from "lucide-react";
import type { AdminCaseItem } from "@/lib/admin";
import { formatDistanceToNow } from "date-fns";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

interface CaseModerationClientProps {
  initialCases: AdminCaseItem[];
}

export function CaseModerationClient({ initialCases }: CaseModerationClientProps) {
  const [selectedTab, setSelectedTab] = useState<"all" | "new" | "flagged" | "approved">("all");

  // Map cases to their moderation categories
  const mappedCases = initialCases.map((c) => {
    let moderationStatus: "new" | "flagged" | "approved" = "approved";

    // 1. A case is flagged if its ai_confidence is low or contains certain keywords
    const isLowConfidence = c.funding ? false : (c.status === "REPORTED" && (c.description.toLowerCase().includes("duplicate") || c.description.toLowerCase().includes("possible duplicate")));
    
    // We can also flag low confidence triages
    if (isLowConfidence) {
      moderationStatus = "flagged";
    } else if (c.status === "REPORTED") {
      moderationStatus = "new";
    } else {
      moderationStatus = "approved";
    }

    return {
      ...c,
      moderationStatus,
    };
  });

  const filteredCases = mappedCases.filter((c) => {
    if (selectedTab === "all") return true;
    return c.moderationStatus === selectedTab;
  });

  // Count categories
  const counts = {
    all: mappedCases.length,
    new: mappedCases.filter((c) => c.moderationStatus === "new").length,
    flagged: mappedCases.filter((c) => c.moderationStatus === "flagged").length,
    approved: mappedCases.filter((c) => c.moderationStatus === "approved").length,
  };

  function getTabStyle(tab: typeof selectedTab) {
    if (selectedTab === tab) {
      return "bg-[#6C5CE7] text-white border-transparent shadow-sm";
    }
    return "bg-white border-[#A788FA]/15 text-[#2D3748]/60 hover:border-[#6C5CE7]/30 hover:text-[#6C5CE7]";
  }

  function getSeverityStyle(severity: string | null) {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "LOW":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Tabs / Filter Chips (Horizontally scrollable on mobile) */}
      <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none shrink-0 -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: "all", label: `All (${counts.all})` },
          { id: "new", label: `New (${counts.new})` },
          { id: "flagged", label: `Flagged (${counts.flagged})` },
          { id: "approved", label: `Approved (${counts.approved})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as "all" | "new" | "flagged" | "approved")}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${getTabStyle(
              tab.id as "all" | "new" | "flagged" | "approved"
            )}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredCases.length === 0 ? (
        <div className="rounded-[20px] border border-[#A788FA]/10 bg-white p-12 text-center flex flex-col items-center gap-3">
          <TabbyMascot variant="celebrate" size="lg" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#2D3748]">All quiet in the moderation queue!</p>
            <p className="text-xs text-[#2D3748]/50 max-w-sm mx-auto leading-relaxed">
              Wonderful job! There are currently no reported cases waiting for admin review or duplicate verification flags. Keep up the awesome work!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              className={`flex flex-col justify-between rounded-[18px] border overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_20px_rgba(108,92,231,0.07)] transition-all bg-white ${
                c.moderationStatus === "flagged"
                  ? "border-red-200 ring-1 ring-red-100/50"
                  : "border-[#A788FA]/15"
              }`}
            >
              {/* Photo & Header info */}
              <div className="relative h-40 bg-slate-50 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.photo_url}
                  alt={c.ai_condition || "Reported case"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${getSeverityStyle(c.ai_severity)}`}>
                    {c.ai_severity || "UNKNOWN"}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold border uppercase tracking-wider ${
                      c.moderationStatus === "new"
                        ? "bg-blue-500 text-white border-transparent"
                        : c.moderationStatus === "flagged"
                        ? "bg-red-500 text-white border-transparent"
                        : "bg-emerald-500 text-white border-transparent"
                    }`}
                  >
                    {c.moderationStatus}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#2D3748] truncate">
                    {c.ai_condition || "Rescue Case"}
                  </h3>
                  <p className="text-xs text-[#2D3748]/60 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="my-2 h-px bg-[#A788FA]/10" />

                {/* Metadata */}
                <div className="space-y-1.5 text-[11px] text-[#2D3748]/60">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <User size={12} className="text-[#A788FA]" />
                    <span className="truncate">Reporter: {c.reporter?.display_name || "Community"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-[#A788FA]" />
                    <span>Submitted: {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#A788FA]" />
                    <span>Fuzzed GPS: {`(13.75, 100.50)`}</span>
                  </div>
                </div>

                {c.moderationStatus === "flagged" && (
                  <div className="rounded-[10px] bg-red-50/50 border border-red-100 p-2.5 flex items-start gap-2">
                    <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-red-700 leading-normal font-medium">
                      Flagged: Potential duplicate or conflicting report notes. Review timeline.
                    </p>
                  </div>
                )}
              </div>

              {/* View Action */}
              <Link
                href={`/cases/${c.id}`}
                className="flex items-center justify-center gap-1 py-3 bg-[#F7F7FB] border-t border-[#A788FA]/10 text-xs font-semibold text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition"
              >
                <Eye size={13} /> View & Triage Report
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
