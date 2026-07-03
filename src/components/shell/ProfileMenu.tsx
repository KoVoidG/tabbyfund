"use client";

import { useTransition } from "react";
import { ChevronDown, User, Settings, LogOut, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/features/auth/actions";
import type { UserProfile } from "@/features/auth/types";
import { Dropdown } from "@/components/ui/Dropdown";

interface ProfileMenuProps {
  profile: UserProfile;
}

/**
 * ProfileMenu — dropdown profile component for the top bar.
 * Groups avatar, name, role badge, and chevron into one interactive control.
 * Dropdown contains Profile, Settings, Switch Account, and Logout.
 */
export function ProfileMenu({ profile }: ProfileMenuProps) {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  const initials = profile.display_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dropdown
      align="right"
      widthClass="w-48"
      trigger={
        <button className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-[#6C5CE7]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/20 cursor-pointer">
          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6C5CE7]/10 text-sm font-semibold text-[#6C5CE7]">
            {initials}
          </div>

          {/* Name + Role */}
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-medium text-[#2D3748] leading-tight">
              {profile.display_name}
            </span>
            <Badge
              variant="secondary"
              className="mt-0.5 px-1.5 py-0 text-[9px] font-semibold uppercase bg-[#6C5CE7]/10 text-[#6C5CE7] border-0"
            >
              {profile.role}
              {profile.role === "vet" && profile.is_verified && "- verified"}
            </Badge>
          </div>

          {/* Chevron */}
          <ChevronDown size={14} strokeWidth={1.5} className="hidden sm:block text-[#2D3748]/40" />
        </button>
      }
    >
      <div className="flex flex-col p-1 space-y-0.5">
        <a
          href="/profile"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#2D3748] hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7] transition"
        >
          <User size={14} strokeWidth={2} />
          Profile
        </a>
        <a
          href="/settings"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#2D3748] hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7] transition"
        >
          <Settings size={14} strokeWidth={2} />
          Settings
        </a>
        <div className="h-px bg-[#A788FA]/10 my-1 mx-2" />
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition text-left cursor-pointer disabled:opacity-50"
        >
          <LogOut size={14} strokeWidth={2} />
          {isPending ? "Signing out..." : "Log out"}
        </button>
      </div>
    </Dropdown>
  );
}
