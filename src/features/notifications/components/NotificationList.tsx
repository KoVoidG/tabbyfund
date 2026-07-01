"use client";

import { useTransition } from "react";
import { Truck, HandCoins, Stethoscope, Heart, PawPrint, Info, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { markNotificationRead, markAllNotificationsRead } from "../actions";
import type { NotificationRow } from "@/lib/notifications";

const typeIcons: Record<string, typeof Truck> = {
  TRANSPORT_CLAIMED: Truck,
  QUOTE_SUBMITTED: Stethoscope,
  FUNDING_OPENED: HandCoins,
  FUNDING_COMPLETED: HandCoins,
  TREATMENT_UPDATED: Stethoscope,
  TREATMENT_COMPLETED: Stethoscope,
  ADOPTION_REQUEST: Heart,
  SYSTEM: Info,
};

interface NotificationListProps {
  notifications: NotificationRow[];
}

export function NotificationList({ notifications }: NotificationListProps) {
  const [isPending, startTransition] = useTransition();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  function handleMarkRead(id: string) {
    startTransition(async () => {
      await markNotificationRead(id);
    });
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsRead();
    });
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleMarkAllRead}
            disabled={isPending}
            className="flex items-center gap-1 rounded-[8px] px-3 py-1.5 text-xs font-medium text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition disabled:opacity-50"
          >
            <CheckCheck size={14} strokeWidth={1.5} /> Mark all read
          </button>
        </div>
      )}

      <div className="rounded-[16px] border border-[#A788FA]/15 bg-white shadow-[0_4px_20px_rgba(108,92,231,0.08)] divide-y divide-[#A788FA]/5">
        {notifications.map((n) => {
          const Icon = typeIcons[n.type] ?? Info;
          const timeAgo = formatDistanceToNow(new Date(n.created_at), { addSuffix: true });

          return (
            <button
              key={n.id}
              onClick={() => !n.is_read && handleMarkRead(n.id)}
              disabled={isPending}
              className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-[#F7F7FB] ${
                !n.is_read ? "bg-[#6C5CE7]/[0.02]" : ""
              }`}
            >
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                !n.is_read ? "bg-[#6C5CE7]/10" : "bg-[#F7F7FB]"
              }`}>
                <Icon size={14} strokeWidth={1.5} className={!n.is_read ? "text-[#6C5CE7]" : "text-[#2D3748]/40"} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-tight ${!n.is_read ? "font-semibold text-[#2D3748]" : "text-[#2D3748]/70"}`}>
                  {n.title}
                </p>
                <p className="mt-0.5 text-xs text-[#2D3748]/50 truncate">{n.message}</p>
                <p className="mt-1 text-[10px] text-[#2D3748]/40">{timeAgo}</p>
              </div>
              {!n.is_read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#6C5CE7]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
