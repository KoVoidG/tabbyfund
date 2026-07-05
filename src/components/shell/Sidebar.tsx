"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  HandHeart,
  TriangleAlert,
  HandCoins,
  HouseHeart,
  PawPrint,
  Stethoscope,
  ShieldCheck,
  Users,
  BarChart3,
  History,
  LogOut,
} from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import type { UserProfile } from "@/features/auth/types";

interface SidebarProps {
  profile: UserProfile;
}

const communityLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/cases", icon: ClipboardList, label: "Rescue Feed" },
  { href: "/volunteer", icon: HandHeart, label: "Volunteer" },
  { href: "/report", icon: TriangleAlert, label: "Report" },
  { href: "/donate", icon: HandCoins, label: "Donate" },
  { href: "/foster", icon: HouseHeart, label: "My Foster" },
  { href: "/adopt", icon: PawPrint, label: "Adopt" },
];

const vetLinks = [
  { href: "/vet", icon: Stethoscope, label: "Vet Dashboard" },
];

const normalAdminLinks = [
  { href: "/admin", icon: ShieldCheck, label: "Admin Operations" },
];

const adminSectionLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Admin Dashboard" },
  { href: "/admin/cases", icon: ClipboardList, label: "Case Management" },
  { href: "/admin/moderation", icon: TriangleAlert, label: "Case Moderation" },
  { href: "/admin/vets", icon: Stethoscope, label: "Veterinarians" },
  { href: "/admin/users", icon: Users, label: "Community Users" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/activity", icon: History, label: "Platform Activity" },
  { href: "/dashboard", icon: LogOut, label: "Exit Admin" },
];

/**
 * Desktop sidebar navigation — visible at md+ breakpoint.
 * Shows role-appropriate links with active state highlighting.
 */
export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const showVet = profile.role === "vet";
  const showAdmin = profile.role === "admin";
  const isAdminPath = pathname.startsWith("/admin");

  function isActive(href: string) {
    if (href === "/dashboard" && !isAdminPath) return pathname === "/dashboard";
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  }

  const activeLinks = isAdminPath ? adminSectionLinks : communityLinks;

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-[#A788FA]/10 bg-white">
      <div className="flex flex-col flex-1 px-4 py-5">
        {/* Logo */}
        <Link href={isAdminPath ? "/admin" : "/dashboard"} className="flex items-center gap-2.5 px-3 mb-6">
          <PawPrint size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
          <span className="text-lg font-bold text-[#6C5CE7]">
            {isAdminPath ? "TabbyAdmin" : "TabbyFund"}
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {activeLinks.map((link) => (
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

          {!isAdminPath && showVet && (
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

          {!isAdminPath && showAdmin && (
            <>
              <div className="my-3 h-px bg-[#A788FA]/10" />
              {normalAdminLinks.map((link) => (
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
          <TabbyMascot variant="sleep" size="md" />
          <p className="text-[11px] text-[#2D3748]/40 text-center">
            {isAdminPath ? "Operations Center" : "Every cat deserves a chance"}
          </p>
        </div>
      </div>
    </aside>
  );
}
