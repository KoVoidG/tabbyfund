"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, PawPrint, Plus, Heart, HandCoins, ShieldCheck, ClipboardList, TriangleAlert, Stethoscope, LogOut } from "lucide-react";

interface NavItem {
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  primary?: boolean;
}

const communityItems: NavItem[] = [
  { href: "/dashboard", icon: House, label: "Home" },
  { href: "/cases", icon: PawPrint, label: "Feed" },
  { href: "/report", icon: Plus, label: "Report", primary: true },
  { href: "/adopt", icon: Heart, label: "Adopt" },
  { href: "/donate", icon: HandCoins, label: "Donate" },
];

const adminItems: NavItem[] = [
  { href: "/admin", icon: ShieldCheck, label: "Dashboard" },
  { href: "/admin/cases", icon: ClipboardList, label: "Cases" },
  { href: "/admin/moderation", icon: TriangleAlert, label: "Moderate" },
  { href: "/admin/vets", icon: Stethoscope, label: "Vets" },
  { href: "/dashboard", icon: LogOut, label: "Exit Admin" },
];

/**
 * Mobile bottom navigation — visible below md breakpoint.
 * Client component for pathname-aware active state.
 */
export function BottomNav() {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/admin");
  const items = isAdminPath ? adminItems : communityItems;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-[#A788FA]/10 bg-white/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around py-1.5">
        {items.map((item) => {
          const isActive = item.href === "/admin" 
            ? pathname === "/admin" 
            : pathname === item.href || pathname.startsWith(item.href + "/");

          if (item.primary && !isAdminPath) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 -mt-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6C5CE7] shadow-[0_2px_8px_rgba(108,92,231,0.3)]">
                  <Plus size={22} strokeWidth={2} className="text-white" />
                </div>
                <span className="text-[10px] font-medium text-[#6C5CE7]">{item.label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-1"
            >
              <item.icon
                size={22}
                strokeWidth={1.5}
                className={isActive ? "text-[#6C5CE7]" : "text-[#2D3748]/40"}
              />
              <span className={`text-[10px] ${isActive ? "font-medium text-[#6C5CE7]" : "text-[#2D3748]/50"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
