import { ProfileMenu } from "./ProfileMenu";
import { NotificationBell } from "./NotificationBell";
import { MobileNav } from "./MobileNav";
import type { UserProfile } from "@/features/auth/types";

interface TopbarProps {
  profile: UserProfile;
}

/**
 * Top bar — sticky header with notification panel and profile menu.
 * Server component wrapping client sub-components.
 */
export function Topbar({ profile }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#A788FA]/10 bg-white/80 backdrop-blur-sm px-4 md:px-6">
      {/* Left: mobile hamburger + title */}
      <div className="flex items-center gap-2">
        <MobileNav profile={profile} />
        <span className="font-heading text-sm font-semibold text-[#6C5CE7] md:hidden">
          TabbyFund
        </span>
      </div>

      {/* Right: notifications + profile menu */}
      <div className="flex items-center gap-4">
        <NotificationBell />
        <ProfileMenu profile={profile} />
      </div>
    </header>
  );
}
