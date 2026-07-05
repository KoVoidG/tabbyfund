import { ProfileMenu } from "./ProfileMenu";
import { NotificationBell } from "./NotificationBell";
import { MobileNav } from "./MobileNav";
import { getUnreadCount, getMyNotifications } from "@/lib/notifications";
import { formatDistanceToNow } from "date-fns";
import type { UserProfile } from "@/features/auth/types";

interface TopbarProps {
  profile: UserProfile;
}

/**
 * Top bar — sticky header with notification panel and profile menu.
 * Server component. Fetches notification data server-side.
 */
export async function Topbar({ profile }: TopbarProps) {
  const [unreadCount, notifications] = await Promise.all([
    getUnreadCount(),
    getMyNotifications(),
  ]);

  const recentNotifications = notifications.slice(0, 5).map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    is_read: n.is_read,
    timeAgo: formatDistanceToNow(new Date(n.created_at), { addSuffix: true }),
  }));

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#A788FA]/10 bg-white/80 backdrop-blur-sm px-4 md:px-6">
      {/* Left: mobile hamburger + title */}
      <div className="flex items-center gap-2">
        <MobileNav profile={profile} />
        <span className="text-sm font-semibold text-[#6C5CE7] md:hidden">
          TabbyFund
        </span>
      </div>

      {/* Right: notifications + profile menu */}
      <div className="flex items-center gap-4">
        <NotificationBell unreadCount={unreadCount} recentNotifications={recentNotifications} />
        <ProfileMenu profile={profile} />
      </div>
    </header>
  );
}
