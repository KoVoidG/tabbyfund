"use client";

import { Bell, Truck, Stethoscope, HandCoins, Heart, Info } from "lucide-react";
import Link from "next/link";
import { Dropdown } from "@/components/ui/Dropdown";

const typeIcons: Record<string, typeof Bell> = {
  TRANSPORT_CLAIMED: Truck,
  QUOTE_SUBMITTED: Stethoscope,
  FUNDING_OPENED: HandCoins,
  FUNDING_COMPLETED: HandCoins,
  TREATMENT_UPDATED: Stethoscope,
  TREATMENT_COMPLETED: Stethoscope,
  ADOPTION_REQUEST: Heart,
  SYSTEM: Info,
};

export interface NotificationPreview {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  timeAgo: string;
}

interface NotificationBellProps {
  unreadCount: number;
  recentNotifications: NotificationPreview[];
}

/**
 * NotificationBell — popover dropdown with recent notifications.
 * Real data passed from server (Topbar).
 */
export function NotificationBell({ unreadCount, recentNotifications }: NotificationBellProps) {
  return (
    <Dropdown
      align="right"
      widthClass="w-80"
      trigger={
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#2D3748]/60 transition-colors hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7]">
          <Bell size={20} strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#6C5CE7] text-[9px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      }
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#A788FA]/10 px-4 py-3">
          <h3 className="text-sm font-semibold text-[#2D3748]">Notifications</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-[#6C5CE7]/10 px-2 py-0.5 text-[10px] font-semibold text-[#6C5CE7]">
              {unreadCount} new
            </span>
          )}
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto">
          {recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center px-4">
              <Bell size={24} strokeWidth={1} className="text-[#A788FA]/30 mb-2" />
              <p className="text-xs text-[#2D3748]/50">No notifications yet</p>
            </div>
          ) : (
            recentNotifications.map((n) => {
              const Icon = typeIcons[n.type] ?? Info;
              return (
                <div
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 border-b border-[#A788FA]/5 last:border-0 ${
                    !n.is_read ? "bg-[#6C5CE7]/[0.02]" : ""
                  }`}
                >
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    !n.is_read ? "bg-[#6C5CE7]/10" : "bg-[#F7F7FB]"
                  }`}>
                    <Icon size={12} strokeWidth={1.5} className={!n.is_read ? "text-[#6C5CE7]" : "text-[#2D3748]/40"} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-[11px] leading-tight ${!n.is_read ? "font-semibold text-[#2D3748]" : "text-[#2D3748]/70"}`}>
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#2D3748]/50 line-clamp-1">{n.message}</p>
                    <p className="mt-0.5 text-[9px] text-[#2D3748]/40">{n.timeAgo}</p>
                  </div>
                  {!n.is_read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6C5CE7]" />}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#A788FA]/10 px-4 py-2.5 text-center">
          <Link href="/notifications" className="text-xs font-medium text-[#6C5CE7] hover:text-[#A788FA] transition-colors">
            See all notifications
          </Link>
        </div>
      </div>
    </Dropdown>
  );
}
