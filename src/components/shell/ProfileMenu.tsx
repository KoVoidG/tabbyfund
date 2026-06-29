"use client";

import { useTransition } from "react";
import { ChevronDown, User, Settings, LogOut, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/features/auth/actions";
import type { UserProfile } from "@/features/auth/types";

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

  function handleSwitchAccount() {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-[#6C5CE7]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/20">
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
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 rounded-xl border-[#A788FA]/15 shadow-[0_4px_20px_rgba(108,92,231,0.1)]">
        <DropdownMenuItem asChild className="flex items-center gap-2 rounded-lg text-sm text-[#2D3748] cursor-pointer focus:bg-[#6C5CE7]/5 focus:text-[#6C5CE7]">
          <a href="/profile">
            <User size={16} strokeWidth={1.5} />
            Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex items-center gap-2 rounded-lg text-sm text-[#2D3748] cursor-pointer focus:bg-[#6C5CE7]/5 focus:text-[#6C5CE7]">
          <a href="/settings">
            <Settings size={16} strokeWidth={1.5} />
            Settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#A788FA]/10" />
        <DropdownMenuItem
          onClick={handleSwitchAccount}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg text-sm text-[#2D3748] cursor-pointer focus:bg-[#6C5CE7]/5 focus:text-[#6C5CE7]"
        >
          <RefreshCw size={16} strokeWidth={1.5} />
          Switch account
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg text-sm text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700"
        >
          <LogOut size={16} strokeWidth={1.5} />
          {isPending ? "Signing out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
