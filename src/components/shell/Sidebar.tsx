"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  PawPrint,
  Plus,
  Heart,
  HandCoins,
  Home,
  Stethoscope,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import type { UserProfile } from "@/features/auth/types";

interface SidebarProps {
  profile: UserProfile;
}

const communityLinks = [
  { href: "/dashboard", icon: House, label: "Dashboard" },
  { href: "/cases", icon: PawPrint, label: "Rescue Feed" },
  { href: "/report", icon: Plus, label: "Report" },
  { href: "/donate", icon: HandCoins, label: "Donate" },
  { href: "/adopt", icon: Heart, label: "Adopt" },
  { href: "/foster", icon: Home, label: "Foster" },
];

const vetLinks = [
  { href: "/vet", icon: Stethoscope, label: "Vet Dashboard" },
];

const adminLinks = [
  { href: "/admin", icon: ShieldCheck, label: "Admin" },
];

/**
 * Desktop sidebar navigation — visible at md+ breakpoint.
 * Shows role-appropriate links with active state highlighting.
 */
export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const showVet = profile.role === "vet" && profile.is_verified;
  const showAdmin = profile.role === "admin";

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-[#A788FA]/10 bg-white">
      <div className="flex flex-col flex-1 px-4 py-5">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 px-3 mb-6">
          <PawPrint size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
          <span className="font-heading text-lg font-bold text-[#6C5CE7]">TabbyFund</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {communityLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm transition-colors ${
                isActive(link.href)
                  ? "bg-[#6C5CE7]/8 text-[#6C5CE7] font-medium"
                  : "text-[#2D3748]/70 hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7]"
              }`}
            >
              <link.icon size={18} strokeWidth={1.5} />
              {link.label}
            </Link>
          ))}

          {showVet && (
            <>
              <div className="my-3 h-px bg-[#A788FA]/10" />
              {vetLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm transition-colors ${
                    isActive(link.href)
                      ? "bg-[#6C5CE7]/8 text-[#6C5CE7] font-medium"
                      : "text-[#2D3748]/70 hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7]"
                  }`}
                >
                  <link.icon size={18} strokeWidth={1.5} />
                  {link.label}
                </Link>
              ))}
            </>
          )}

          {showAdmin && (
            <>
              <div className="my-3 h-px bg-[#A788FA]/10" />
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm transition-colors ${
                    isActive(link.href)
                      ? "bg-[#6C5CE7]/8 text-[#6C5CE7] font-medium"
                      : "text-[#2D3748]/70 hover:bg-[#6C5CE7]/5 hover:text-[#6C5CE7]"
                  }`}
                >
                  <link.icon size={18} strokeWidth={1.5} />
                  {link.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Bottom mascot */}
        <div className="mt-auto flex flex-col items-center gap-2 px-3 py-4">
          <TabbyMascot variant="wave" size="md" />
          <p className="text-[11px] text-[#2D3748]/40 text-center">Every cat deserves a chance</p>
        </div>
      </div>
    </aside>
  );
}
