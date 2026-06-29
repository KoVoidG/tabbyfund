"use client";

import { useState } from "react";
import { Home, PawPrint, Heart, CircleCheck, Calendar, User, ChevronRight, ClipboardList } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { BehaviouralProfileForm } from "@/features/adoption/components/BehaviouralProfileForm";
import Link from "next/link";

const tabs = ["Assigned to Me", "Behaviour Profiles", "Ready for Adoption"] as const;

const mockFosterCats = [
  {
    id: "c0000000-0000-0000-0000-000000000009",
    name: "Somtam",
    photo: "https://placehold.co/200x200/F3C9A6/2D3748?text=Somtam",
    days: 7,
    status: "active",
    profileComplete: true,
  },
  {
    id: "foster-new-1",
    name: "Mochi",
    photo: "https://placehold.co/200x200/FFF3E0/2D3748?text=Mochi",
    days: 3,
    status: "active",
    profileComplete: false,
  },
];

export default function FosterPage() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Assigned to Me");

  const assigned = mockFosterCats;
  const needsProfile = mockFosterCats.filter((c) => !c.profileComplete);
  const readyForAdoption = mockFosterCats.filter((c) => c.profileComplete);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Hero */}
      <div className="flex items-center gap-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <TabbyMascot variant="love" size="lg" />
        <div>
          <h1 className="font-heading text-xl font-bold text-[#2D3748]">Foster Dashboard</h1>
          <p className="mt-1 text-sm text-[#2D3748]/60">Care for rescued cats until they find their forever home.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon =
            tab === "Assigned to Me" ? PawPrint :
            tab === "Behaviour Profiles" ? ClipboardList :
            Heart;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition ${
                activeTab === tab
                  ? "bg-[#6C5CE7] text-white"
                  : "bg-white border border-[#A788FA]/15 text-[#2D3748]/60 hover:border-[#6C5CE7]/30"
              }`}
            >
              <Icon size={13} strokeWidth={1.5} />
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "Assigned to Me" && (
        <div className="space-y-3">
          {assigned.map((cat) => (
            <div key={cat.id} className="flex items-center gap-4 rounded-[14px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.06)] transition-shadow hover:shadow-[0_6px_20px_rgba(108,92,231,0.12)]">
              <div className="h-14 w-14 shrink-0 rounded-[10px] overflow-hidden bg-[#F7F7FB]">
                <img src={cat.photo} alt={cat.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2D3748]">{cat.name}</p>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-[#2D3748]/50">
                  <span className="flex items-center gap-0.5"><Calendar size={10} strokeWidth={1.5} />{cat.days} days</span>
                  <span className="flex items-center gap-0.5"><Home size={10} strokeWidth={1.5} />In foster</span>
                </div>
                {cat.profileComplete && (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                    <CircleCheck size={9} strokeWidth={2} /> Profile Complete
                  </span>
                )}
              </div>
              <ChevronRight size={16} strokeWidth={1.5} className="text-[#2D3748]/20" />
            </div>
          ))}
        </div>
      )}

      {activeTab === "Behaviour Profiles" && (
        <div className="space-y-6">
          {needsProfile.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <TabbyMascot variant="happy" size="lg" />
              <p className="mt-3 text-sm font-medium text-[#2D3748]">All profiles complete!</p>
              <p className="text-xs text-[#2D3748]/50">No pending behavioural profiles.</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-[#2D3748]/60">Complete the behavioural profile so these cats can appear on the public adoption page.</p>
              {needsProfile.map((cat) => (
                <div key={cat.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-[8px] overflow-hidden bg-[#F7F7FB]">
                      <img src={cat.photo} alt={cat.name} className="h-full w-full object-cover" />
                    </div>
                    <p className="text-sm font-semibold text-[#2D3748]">{cat.name}</p>
                  </div>
                  <BehaviouralProfileForm />
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {activeTab === "Ready for Adoption" && (
        <div className="space-y-3">
          {readyForAdoption.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <TabbyMascot variant="think" size="lg" />
              <p className="mt-3 text-sm font-medium text-[#2D3748]">No cats ready yet</p>
              <p className="text-xs text-[#2D3748]/50">Complete behavioural profiles first.</p>
            </div>
          ) : (
            readyForAdoption.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between rounded-[14px] border border-emerald-200/50 bg-emerald-50/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-[10px] overflow-hidden bg-[#F7F7FB]">
                    <img src={cat.photo} alt={cat.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2D3748]">{cat.name}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                      <CircleCheck size={10} strokeWidth={1.5} /> Adoption-ready
                    </span>
                  </div>
                </div>
                <Link href={`/adopt/${cat.id}`} className="rounded-[8px] bg-[#6C5CE7] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#A788FA] transition">
                  View Listing
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
