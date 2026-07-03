"use client";

import { useState } from "react";
import Link from "next/link";
import {
  History,
  Search,
  X,
  Calendar,
  ArrowRight,
  User,
  Stethoscope,
  HandCoins,
  Heart,
  Home,
  AlertCircle,
  Plus,
  ClipboardList,
} from "lucide-react";
import type { PlatformActivityItem } from "@/lib/admin";
import { formatDistanceToNow } from "date-fns";
import { CustomSelect } from "@/components/ui/CustomSelect";

interface PlatformActivityClientProps {
  initialActivities: PlatformActivityItem[];
}

export function PlatformActivityClient({ initialActivities }: PlatformActivityClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filteredActivities = initialActivities.filter((a) => {
    // 1. Text search matching title or description
    const titleMatch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = a.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (searchQuery && !titleMatch && !descMatch) return false;

    // 2. Type filter
    if (selectedType !== "all") {
      if (selectedType === "rescues" && a.type !== "rescue_reported") return false;
      if (selectedType === "vets" && a.type !== "vet_approved" && a.type !== "quote_created") return false;
      if (selectedType === "donations" && a.type !== "donation_received") return false;
      if (selectedType === "transitions" && (a.type === "rescue_reported" || a.type === "vet_approved" || a.type === "quote_created" || a.type === "donation_received")) return false;
    }

    return true;
  });

  function getActivityIcon(type: string) {
    switch (type) {
      case "rescue_reported":
        return <Plus className="text-blue-600" size={14} />;
      case "vet_approved":
        return <Stethoscope className="text-teal-600" size={14} />;
      case "quote_created":
        return <ClipboardList className="text-indigo-600" size={14} />;
      case "donation_received":
        return <HandCoins className="text-emerald-600" size={14} />;
      case "funding_completed":
        return <SparkleIcon className="text-amber-500" />;
      case "treatment_completed":
        return <Heart className="text-pink-600" size={14} />;
      case "foster_assigned":
        return <Home className="text-purple-600" size={14} />;
      case "adoption_completed":
        return <Heart className="text-red-600" size={14} />;
      default:
        return <AlertCircle className="text-slate-600" size={14} />;
    }
  }

  function SparkleIcon(props: any) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center rounded-[20px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.03)]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#2D3748]/40" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[10px] border border-[#A788FA]/15 pl-9 pr-8 py-2 text-xs focus:border-[#6C5CE7] focus:outline-none placeholder:text-[#2D3748]/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-[#2D3748]/40 hover:text-[#2D3748]"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <CustomSelect
            value={selectedType}
            onChange={setSelectedType}
            options={[
              { value: "all", label: "All Events" },
              { value: "rescues", label: "Rescues Reported" },
              { value: "vets", label: "Vet Activities" },
              { value: "donations", label: "Donations" },
              { value: "transitions", label: "Lifecycle Transitions" },
            ]}
            widthClass="w-48"
          />
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="rounded-[20px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.04)]">
        {filteredActivities.length === 0 ? (
          <p className="text-xs text-[#2D3748]/40 text-center py-6">No platform activity records found matching filters.</p>
        ) : (
          <div className="relative border-l-2 border-[#6C5CE7]/10 ml-4 pl-6 space-y-6">
            {filteredActivities.map((a) => (
              <div key={a.id} className="relative group">
                {/* Timeline Node Icon Container */}
                <span className="absolute -left-[35px] top-0 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white border-2 border-[#6C5CE7]">
                  {getActivityIcon(a.type)}
                </span>
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <p className="text-xs font-bold text-[#2D3748]">{a.title}</p>
                    <span className="text-[10px] text-[#2D3748]/45 flex items-center gap-0.5">
                      <Calendar size={10} />
                      {formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-[#2D3748]/60 leading-relaxed">{a.description}</p>
                  {a.caseId && (
                    <Link
                      href={`/cases/${a.caseId}`}
                      className="inline-flex items-center gap-0.5 text-[10px] text-[#6C5CE7] font-semibold hover:underline mt-1"
                    >
                      View Rescue Case <ArrowRight size={8} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
