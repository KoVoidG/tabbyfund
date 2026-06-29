"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, House, PawPrint, Plus, Heart, HandCoins, Home, Stethoscope, ShieldCheck } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { UserProfile } from "@/features/auth/types";

interface MobileNavProps {
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
 * Mobile navigation drawer — hamburger menu triggering a Sheet from the left.
 * Shows the same routes as the desktop Sidebar with active state highlighting.
 * Only visible below the md breakpoint.
 */
export function MobileNav({ profile }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const showVet = profile.role === "vet" && profile.is_verified;
  const showAdmin = profile.role === "admin";

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[#6C5CE7]/5"
          aria-label="Open navigation menu"
        >
          <Menu size={22} strokeWidth={1.5} className="text-[#2D3748]/70" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-[#A788FA]/10 px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-[#6C5CE7]">
            <PawPrint size={18} strokeWidth={1.5} />
            TabbyFund
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {communityLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
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
                  onClick={() => setOpen(false)}
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
                  onClick={() => setOpen(false)}
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
      </SheetContent>
    </Sheet>
  );
}
