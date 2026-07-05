import { Bell, Truck, HandCoins, Stethoscope, Heart, PawPrint, Info } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { getMyNotifications } from "@/lib/notifications";
import { NotificationList } from "@/features/notifications/components/NotificationList";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Notifications — TabbyFund",
};

/**
 * /notifications — real notifications from Supabase.
 */
export default async function NotificationsPage() {
  const notifications = await getMyNotifications();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
            <Bell size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#2D3748]">Notifications</h1>
            <p className="text-xs text-[#2D3748]/60">{unreadCount} unread</p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <TabbyMascot variant="confused" size="lg" />
          <p className="mt-3 text-sm font-medium text-[#2D3748]">No notifications yet</p>
          <p className="mt-1 text-xs text-[#2D3748]/50">You&apos;ll see updates here as your rescue cases progress.</p>
        </div>
      ) : (
        <NotificationList notifications={notifications} />
      )}
    </div>
  );
}
