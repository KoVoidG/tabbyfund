"use client";

import { Bell, Truck, Stethoscope, HandCoins, Heart, CircleCheck } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Mock notification data for demo purposes.
 * Will be replaced with real data from the notifications table later.
 */
const mockNotifications = [
  {
    id: "1",
    icon: Truck,
    title: "Transport claimed",
    message: "Prawit C. is transporting the cat from Sukhumvit.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    icon: Stethoscope,
    title: "Vet quote submitted",
    message: "Dr. Siriporn quoted ฿4,500 for treatment.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    icon: HandCoins,
    title: "Donation received",
    message: "Someone donated ฿500 to your rescue case.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    icon: CircleCheck,
    title: "Treatment completed",
    message: "The tabby from Thonglor has fully recovered!",
    time: "2 days ago",
    read: true,
  },
  {
    id: "5",
    icon: Heart,
    title: "Adoption request",
    message: "Kannika W. wants to adopt the orange tabby.",
    time: "3 days ago",
    read: true,
  },
];

/**
 * NotificationBell — popover panel showing recent notifications.
 * Uses mock data for demo. Will connect to real notifications table later.
 */
export function NotificationBell() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#2D3748]/60 transition-colors hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7]">
          <Bell size={20} strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#6C5CE7] text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 rounded-xl border-[#A788FA]/15 p-0 shadow-[0_4px_20px_rgba(108,92,231,0.1)]"
      >
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
        <div className="max-h-80 overflow-y-auto">
          {mockNotifications.map((n) => (
            <div
              key={n.id}
              className={`flex gap-3 px-4 py-3 border-b border-[#A788FA]/5 last:border-0 transition-colors hover:bg-[#F7F7FB] ${
                !n.read ? "bg-[#6C5CE7]/[0.02]" : ""
              }`}
            >
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                !n.read ? "bg-[#6C5CE7]/10" : "bg-[#F7F7FB]"
              }`}>
                <n.icon size={14} strokeWidth={1.5} className={!n.read ? "text-[#6C5CE7]" : "text-[#2D3748]/40"} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs leading-tight ${!n.read ? "font-semibold text-[#2D3748]" : "font-medium text-[#2D3748]/70"}`}>
                  {n.title}
                </p>
                <p className="mt-0.5 text-[11px] text-[#2D3748]/50 line-clamp-1">
                  {n.message}
                </p>
                <p className="mt-1 text-[10px] text-[#2D3748]/40">{n.time}</p>
              </div>
              {!n.read && (
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#6C5CE7]" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-[#A788FA]/10 px-4 py-2.5 text-center">
          <a href="/notifications" className="text-xs font-medium text-[#6C5CE7] hover:text-[#A788FA] transition-colors">
            View all notifications
          </a>
        </div>
      </PopoverContent>
    </Popover>
  );
}
