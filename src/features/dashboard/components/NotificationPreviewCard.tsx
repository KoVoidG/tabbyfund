import { Bell } from "lucide-react";

interface NotificationPreviewCardProps {
  notifications: {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
  }[];
}

/**
 * NotificationPreviewCard — compact notification list for dashboard.
 * Shows the most recent notifications with read/unread state.
 */
export function NotificationPreviewCard({ notifications }: NotificationPreviewCardProps) {
  return (
    <div className="rounded-[14px] border border-[#A788FA]/15 bg-white shadow-[0_2px_12px_rgba(108,92,231,0.06)]">
      {notifications.map((n, i) => (
        <div
          key={n.id}
          className={`flex items-start gap-3 px-4 py-3 ${
            i < notifications.length - 1 ? "border-b border-[#A788FA]/5" : ""
          } ${!n.read ? "bg-[#6C5CE7]/[0.02]" : ""}`}
        >
          <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
            !n.read ? "bg-[#6C5CE7]/10" : "bg-[#F7F7FB]"
          }`}>
            <Bell size={12} strokeWidth={1.5} className={!n.read ? "text-[#6C5CE7]" : "text-[#2D3748]/40"} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-xs leading-tight ${!n.read ? "font-semibold text-[#2D3748]" : "text-[#2D3748]/70"}`}>
              {n.title}
            </p>
            <p className="mt-0.5 text-[11px] text-[#2D3748]/50 truncate">{n.message}</p>
            <p className="mt-0.5 text-[10px] text-[#2D3748]/40">{n.time}</p>
          </div>
          {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#6C5CE7]" />}
        </div>
      ))}
    </div>
  );
}
