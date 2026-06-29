"use client";

import { useState } from "react";
import { Bell, Truck, HandCoins, Stethoscope, Heart, PawPrint, Info, CheckCheck } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { allNotifications, type MockNotification } from "@/features/notifications/mock-data";

const typeIcons = {
  rescue: PawPrint,
  funding: HandCoins,
  transport: Truck,
  treatment: Stethoscope,
  adoption: Heart,
  system: Info,
};

const tabs = ["All", "Rescue", "Funding", "Transport", "Treatment", "Adoption", "System"] as const;

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [notifications, setNotifications] = useState(allNotifications);

  const filtered = activeTab === "All"
    ? notifications
    : notifications.filter((n) => n.type === activeTab.toLowerCase());

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
            <Bell size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold text-[#2D3748]">Notifications</h1>
            <p className="text-xs text-[#2D3748]/60">{unreadCount} unread</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 rounded-[8px] px-3 py-1.5 text-xs font-medium text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition"
          >
            <CheckCheck size={14} strokeWidth={1.5} /> Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              activeTab === tab
                ? "bg-[#6C5CE7] text-white"
                : "bg-white border border-[#A788FA]/15 text-[#2D3748]/60 hover:border-[#6C5CE7]/30"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <TabbyMascot variant="confused" size="lg" />
          <p className="mt-3 text-sm font-medium text-[#2D3748]">No notifications</p>
          <p className="mt-1 text-xs text-[#2D3748]/50">Nothing to show in this category yet.</p>
        </div>
      ) : (
        <div className="rounded-[16px] border border-[#A788FA]/15 bg-white shadow-[0_4px_20px_rgba(108,92,231,0.08)] divide-y divide-[#A788FA]/5">
          {filtered.map((n) => {
            const Icon = typeIcons[n.type];
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-[#F7F7FB] ${
                  !n.read ? "bg-[#6C5CE7]/[0.02]" : ""
                }`}
              >
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  !n.read ? "bg-[#6C5CE7]/10" : "bg-[#F7F7FB]"
                }`}>
                  <Icon size={14} strokeWidth={1.5} className={!n.read ? "text-[#6C5CE7]" : "text-[#2D3748]/40"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-tight ${!n.read ? "font-semibold text-[#2D3748]" : "text-[#2D3748]/70"}`}>
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#2D3748]/50 truncate">{n.message}</p>
                  <p className="mt-1 text-[10px] text-[#2D3748]/40">{n.time}</p>
                </div>
                {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#6C5CE7]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
