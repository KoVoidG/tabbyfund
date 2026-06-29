import {
  House,
  Heart,
  Search,
  Bell,
  User,
  Settings,
  PawPrint,
  MapPin,
  Camera,
  Siren,
  Stethoscope,
  ShieldCheck,
  HandCoins,
  Wallet,
  Gift,
  CircleCheck,
  CircleAlert,
  TriangleAlert,
  Info,
  LoaderCircle,
  Plus,
  Pencil,
  Trash2,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Truck,
  Clock,
  DollarSign,
  HeartPulse,
  Home,
} from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

/**
 * Design Preview — TabbyFund Design System
 * Route: /design-preview
 *
 * Official Palette:
 *   #6C5CE7 Primary Purple
 *   #A788FA Light Purple
 *   #F3C9A6 Peach (accent only)
 *   #FFF3E0 Cream (soft sections)
 *   #F7F7FB Very Light Lavender (page bg)
 *   #2D3748 Dark Gray (text)
 *
 * Icons: lucide-react only. Outline style. Consistent stroke/size.
 * Mascot: only illustrated element (emoji placeholder for now).
 */
export default function DesignPreviewPage() {
  return (
    <div className="min-h-dvh bg-[#F7F7FB] px-4 py-8 font-sans">
      <div className="mx-auto max-w-5xl space-y-12">

        {/* HEADER */}
        <header className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#6C5CE7]/10">
            <PawPrint size={28} className="text-[#6C5CE7]" strokeWidth={1.5} />
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#6C5CE7] md:text-4xl">
            TabbyFund
          </h1>
          <p className="mt-1 text-sm text-[#2D3748]/70">
            Community-powered cat rescue · Design System Preview
          </p>
        </header>

        {/* COLOR PALETTE */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Color Palette</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {[
              { color: "#6C5CE7", name: "Primary Purple" },
              { color: "#A788FA", name: "Light Purple" },
              { color: "#F3C9A6", name: "Peach" },
              { color: "#FFF3E0", name: "Cream" },
              { color: "#F7F7FB", name: "Light Lavender" },
              { color: "#2D3748", name: "Dark Gray" },
            ].map((c) => (
              <div key={c.color} className="flex flex-col items-center gap-1.5">
                <div className="h-14 w-full rounded-[12px] border border-[#A788FA]/10" style={{ backgroundColor: c.color }} />
                <span className="text-[11px] font-medium text-[#2D3748]">{c.color}</span>
                <span className="text-[10px] text-[#2D3748]/60">{c.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* TYPOGRAPHY */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Typography</h2>
          <div className="mt-4 space-y-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
            <div>
              <span className="text-[11px] font-medium text-[#A788FA]">H1 — Bold 24-28px</span>
              <h1 className="font-heading text-[26px] font-bold text-[#6C5CE7]">Every Cat Deserves a Chance</h1>
            </div>
            <div>
              <span className="text-[11px] font-medium text-[#A788FA]">H2 — SemiBold 18px</span>
              <h2 className="font-heading text-lg font-semibold text-[#2D3748]">Rescue Case Details</h2>
            </div>
            <div>
              <span className="text-[11px] font-medium text-[#A788FA]">Body — Regular 14-16px</span>
              <p className="text-[15px] text-[#2D3748]">Found an injured cat near Sukhumvit. The cat appears unable to stand.</p>
            </div>
            <div>
              <span className="text-[11px] font-medium text-[#A788FA]">Caption — 12-14px muted</span>
              <p className="text-[13px] text-[#2D3748]/70">Reported 2 hours ago · Bangkok</p>
            </div>
          </div>
        </section>

        {/* ICON LIBRARY */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Icons (Lucide React)</h2>
          <p className="mt-1 text-xs text-[#2D3748]/70">Outline only · strokeWidth 1.5 · Consistent sizes</p>
          <div className="mt-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
              {[
                { icon: <House size={20} strokeWidth={1.5} />, name: "House" },
                { icon: <Heart size={20} strokeWidth={1.5} />, name: "Heart" },
                { icon: <Search size={20} strokeWidth={1.5} />, name: "Search" },
                { icon: <Bell size={20} strokeWidth={1.5} />, name: "Bell" },
                { icon: <User size={20} strokeWidth={1.5} />, name: "User" },
                { icon: <Settings size={20} strokeWidth={1.5} />, name: "Settings" },
                { icon: <PawPrint size={20} strokeWidth={1.5} />, name: "PawPrint" },
                { icon: <MapPin size={20} strokeWidth={1.5} />, name: "MapPin" },
                { icon: <Camera size={20} strokeWidth={1.5} />, name: "Camera" },
                { icon: <Siren size={20} strokeWidth={1.5} />, name: "Siren" },
                { icon: <Stethoscope size={20} strokeWidth={1.5} />, name: "Stethoscope" },
                { icon: <ShieldCheck size={20} strokeWidth={1.5} />, name: "ShieldCheck" },
                { icon: <HandCoins size={20} strokeWidth={1.5} />, name: "HandCoins" },
                { icon: <Wallet size={20} strokeWidth={1.5} />, name: "Wallet" },
                { icon: <Gift size={20} strokeWidth={1.5} />, name: "Gift" },
                { icon: <CircleCheck size={20} strokeWidth={1.5} />, name: "CircleCheck" },
                { icon: <CircleAlert size={20} strokeWidth={1.5} />, name: "CircleAlert" },
                { icon: <TriangleAlert size={20} strokeWidth={1.5} />, name: "TriangleAlert" },
                { icon: <Info size={20} strokeWidth={1.5} />, name: "Info" },
                { icon: <LoaderCircle size={20} strokeWidth={1.5} />, name: "LoaderCircle" },
                { icon: <Plus size={20} strokeWidth={1.5} />, name: "Plus" },
                { icon: <Pencil size={20} strokeWidth={1.5} />, name: "Pencil" },
                { icon: <Trash2 size={20} strokeWidth={1.5} />, name: "Trash2" },
                { icon: <ChevronRight size={20} strokeWidth={1.5} />, name: "ChevronRight" },
              ].map((item) => (
                <div key={item.name} className="flex flex-col items-center gap-1 text-[#2D3748]">
                  {item.icon}
                  <span className="text-[9px] text-[#2D3748]/60">{item.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-6 border-t border-[#A788FA]/10 pt-4">
              <div className="flex items-center gap-2">
                <PawPrint size={16} strokeWidth={1.5} className="text-[#6C5CE7]" />
                <span className="text-xs text-[#2D3748]/70">16px inline</span>
              </div>
              <div className="flex items-center gap-2">
                <PawPrint size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
                <span className="text-xs text-[#2D3748]/70">20px buttons</span>
              </div>
              <div className="flex items-center gap-2">
                <PawPrint size={24} strokeWidth={1.5} className="text-[#6C5CE7]" />
                <span className="text-xs text-[#2D3748]/70">24px nav/cards</span>
              </div>
              <div className="flex items-center gap-2">
                <PawPrint size={36} strokeWidth={1.5} className="text-[#6C5CE7]" />
                <span className="text-xs text-[#2D3748]/70">36px empty states</span>
              </div>
            </div>
          </div>
        </section>

        {/* BUTTONS */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Buttons</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <p className="text-xs font-medium text-[#2D3748]/60">Primary</p>
              <button className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition-all hover:bg-[#A788FA] active:scale-[0.98]">
                <HandCoins size={16} strokeWidth={1.5} />
                Donate Now
              </button>
              <button className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition-all hover:bg-[#A788FA] active:scale-[0.98]">
                <Plus size={16} strokeWidth={1.5} />
                Report Injured Cat
              </button>
            </div>
            <div className="space-y-3 rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <p className="text-xs font-medium text-[#2D3748]/60">Secondary / Outline</p>
              <button className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-[#A788FA] bg-transparent text-sm font-semibold text-[#6C5CE7] transition-all hover:bg-[#F7F7FB]">
                <ArrowRight size={16} strokeWidth={1.5} />
                View Details
              </button>
              <button className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-[#A788FA] bg-transparent text-sm font-semibold text-[#6C5CE7] transition-all hover:bg-[#F7F7FB]">
                <Heart size={16} strokeWidth={1.5} />
                Volunteer
              </button>
            </div>
            <div className="space-y-3 rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <p className="text-xs font-medium text-[#2D3748]/60">Disabled / Loading</p>
              <button disabled className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7]/40 text-sm font-semibold text-white cursor-not-allowed">
                <LoaderCircle size={16} strokeWidth={1.5} className="animate-spin" />
                Submitting...
              </button>
              <button disabled className="flex h-11 w-full items-center justify-center rounded-[12px] border border-[#A788FA]/40 text-sm font-semibold text-[#6C5CE7]/40 cursor-not-allowed">
                Disabled
              </button>
            </div>
            <div className="space-y-3 rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <p className="text-xs font-medium text-[#2D3748]/60">Icon Buttons</p>
              <div className="flex gap-3">
                <button className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#6C5CE7] text-white transition hover:bg-[#A788FA]">
                  <Heart size={18} strokeWidth={1.5} />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#A788FA] text-[#6C5CE7] transition hover:bg-[#F7F7FB]">
                  <MapPin size={18} strokeWidth={1.5} />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#A788FA] text-[#6C5CE7] transition hover:bg-[#F7F7FB]">
                  <Camera size={18} strokeWidth={1.5} />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#A788FA] text-[#6C5CE7] transition hover:bg-[#F7F7FB]">
                  <Bell size={18} strokeWidth={1.5} />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#A788FA] text-[#6C5CE7] transition hover:bg-[#F7F7FB]">
                  <Pencil size={18} strokeWidth={1.5} />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-red-300 text-red-500 transition hover:bg-red-50">
                  <Trash2 size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* INPUTS */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Inputs</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2D3748]">Email</label>
                <input type="email" placeholder="you@example.com" className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2D3748]">Password</label>
                <input type="password" placeholder="••••••••" className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2D3748]">Search</label>
                <div className="relative">
                  <Search size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A788FA]" />
                  <input type="search" placeholder="Search rescue cases..." className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white pl-10 pr-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#2D3748]">Description</label>
                <textarea placeholder="Describe the cat's condition..." rows={3} className="w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 py-3 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15 resize-none" />
              </div>
            </div>
            <div className="space-y-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-red-600">
                  <CircleAlert size={14} strokeWidth={1.5} /> Error State
                </label>
                <input type="email" defaultValue="invalid" className="h-11 w-full rounded-[12px] border-2 border-red-400 bg-red-50/50 px-4 text-sm text-[#2D3748] focus:outline-none focus:ring-2 focus:ring-red-200" />
                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <TriangleAlert size={12} strokeWidth={1.5} /> Please enter a valid email
                </p>
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                  <CircleCheck size={14} strokeWidth={1.5} /> Success State
                </label>
                <input type="email" defaultValue="user@tabbyfund.com" className="h-11 w-full rounded-[12px] border-2 border-emerald-400 bg-emerald-50/50 px-4 text-sm text-[#2D3748] focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <CircleCheck size={12} strokeWidth={1.5} /> Email verified
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6C5CE7]">Focus State (click below)</label>
                <input type="text" placeholder="Click to see focus ring" className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15" />
              </div>
            </div>
          </div>
        </section>

        {/* CARDS */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Cards</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Rescue Case Card */}
            <div className="overflow-hidden rounded-[16px] border border-[#A788FA]/15 bg-white shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <div className="flex h-36 items-center justify-center bg-gradient-to-br from-[#F7F7FB] to-[#A788FA]/10">
                <PawPrint size={40} strokeWidth={1.5} className="text-[#A788FA]/40" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    <CircleAlert size={10} strokeWidth={2} /> Critical
                  </span>
                  <span className="text-xs text-[#2D3748]/60">2h ago</span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-[#2D3748]">Injured cat near Sukhumvit Soi 23</h3>
                <p className="mt-1 line-clamp-2 text-xs text-[#2D3748]/70">Found a cat hit by a vehicle. Hind leg appears broken.</p>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#6C5CE7]">฿2,800</span>
                    <span className="text-[#2D3748]/60">of ฿4,500</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#A788FA]/15">
                    <div className="h-full rounded-full bg-[#6C5CE7]" style={{ width: "62%" }} />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-1 rounded-[10px] bg-[#6C5CE7] py-2 text-xs font-semibold text-white hover:bg-[#A788FA]">
                    <HandCoins size={13} strokeWidth={1.5} /> Donate
                  </button>
                  <button className="flex flex-1 items-center justify-center gap-1 rounded-[10px] border border-[#A788FA] py-2 text-xs font-semibold text-[#6C5CE7] hover:bg-[#F7F7FB]">
                    <Heart size={13} strokeWidth={1.5} /> Volunteer
                  </button>
                </div>
              </div>
            </div>

            {/* Donation Card */}
            <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6C5CE7]/10">
                  <Wallet size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2D3748]">฿500 donated</p>
                  <p className="text-xs text-[#2D3748]/60">by สมชาย · 2 hours ago</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-[10px] bg-[#F7F7FB] p-3">
                <ShieldCheck size={16} strokeWidth={1.5} className="text-[#6C5CE7] shrink-0" />
                <p className="text-xs text-[#2D3748]/70">Held in escrow until treatment is confirmed.</p>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#6C5CE7]" />
                <span className="text-[11px] font-medium text-[#6C5CE7]">HELD IN ESCROW</span>
              </div>
            </div>

            {/* Vet Summary Card */}
            <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF3E0]">
                  <Stethoscope size={20} strokeWidth={1.5} className="text-[#2D3748]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2D3748]">Dr. Siriporn</p>
                  <p className="flex items-center gap-1 text-xs text-[#6C5CE7]">
                    <ShieldCheck size={12} strokeWidth={1.5} /> Verified
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-[#2D3748]/60">Cost</span><span className="font-semibold text-[#2D3748]">฿4,500</span></div>
                <div className="flex justify-between"><span className="text-[#2D3748]/60">Recovery</span><span className="font-semibold text-[#2D3748]">2 weeks</span></div>
                <div className="flex justify-between"><span className="text-[#2D3748]/60">Status</span><span className="font-semibold text-[#6C5CE7]">In Treatment</span></div>
              </div>
            </div>

            {/* Empty State Card */}
            <div className="flex flex-col items-center justify-center rounded-[16px] border border-[#A788FA]/15 bg-white p-8 text-center shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F3C9A6]/15">
                <PawPrint size={28} strokeWidth={1.5} className="text-[#F3C9A6]" />
              </div>
              <p className="text-sm font-medium text-[#2D3748]">No rescue cases nearby</p>
              <p className="mt-1 text-xs text-[#2D3748]/60">Hopefully every cat is safe today.</p>
              <button className="mt-4 flex items-center gap-1.5 rounded-[10px] bg-[#6C5CE7] px-5 py-2 text-xs font-semibold text-white hover:bg-[#A788FA]">
                <Search size={13} strokeWidth={1.5} /> Browse All
              </button>
            </div>
          </div>
        </section>

        {/* MESSAGES & BADGES */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Messages</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3">
              <CircleAlert size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-red-600" />
              <p className="text-sm text-[#2D3748]"><span className="font-medium">Invalid email or password.</span> Please try again.</p>
            </div>
            <div className="flex items-start gap-3 rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-3">
              <CircleCheck size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-emerald-600" />
              <p className="text-sm text-[#2D3748]"><span className="font-medium">Password reset link sent!</span> Check your email.</p>
            </div>
            <div className="flex items-start gap-3 rounded-[12px] border border-amber-200 bg-amber-50 px-4 py-3">
              <TriangleAlert size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-sm text-[#2D3748]"><span className="font-medium">Funding goal almost reached.</span> Only ฿200 remaining.</p>
            </div>
            <div className="flex items-start gap-3 rounded-[12px] border border-[#A788FA]/20 bg-[#A788FA]/5 px-4 py-3">
              <Info size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#6C5CE7]" />
              <p className="text-sm text-[#6C5CE7]">AI analysis is currently unavailable. Your report was still submitted.</p>
            </div>
          </div>
        </section>

        {/* SEVERITY BADGES */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Severity Badges</h2>
          <p className="mt-1 text-xs text-[#2D3748]/70">Icon + color + text for accessibility. Color-blind safe via icon differentiation.</p>
          <div className="mt-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                <CircleAlert size={12} strokeWidth={2} /> Critical
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                <TriangleAlert size={12} strokeWidth={2} /> High
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-[#2D3748]">
                <Info size={12} strokeWidth={2} /> Medium
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                <CircleCheck size={12} strokeWidth={2} /> Low
              </span>
            </div>
            <p className="mt-4 text-[11px] text-[#2D3748]/60">Solid backgrounds with white/dark text. Each severity has a unique icon shape for color-blind users.</p>
          </div>
        </section>

        {/* CASE STATUS BADGES */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Case Status Badges</h2>
          <p className="mt-1 text-xs text-[#2D3748]/70">Workflow-based colors. Title Case. Icon + label for clarity.</p>
          <div className="mt-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                <Clock size={12} strokeWidth={1.5} /> Reported
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                <Truck size={12} strokeWidth={1.5} /> Awaiting Transport
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <Truck size={12} strokeWidth={1.5} /> In Transit
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                <Stethoscope size={12} strokeWidth={1.5} /> At Vet
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                <DollarSign size={12} strokeWidth={1.5} /> Funding Open
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-700">
                <CircleCheck size={12} strokeWidth={1.5} /> Fully Funded
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                <HeartPulse size={12} strokeWidth={1.5} /> In Treatment
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700">
                <HeartPulse size={12} strokeWidth={1.5} /> Recovering
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                <Home size={12} strokeWidth={1.5} /> In Foster
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700">
                <Heart size={12} strokeWidth={1.5} /> Ready for Adoption
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                <CircleCheck size={12} strokeWidth={1.5} /> Adopted
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                <X size={12} strokeWidth={1.5} /> Closed
              </span>
            </div>
            <p className="mt-4 text-[11px] text-[#2D3748]/60">Each status has a distinct color band + icon. Readable without color alone.</p>
          </div>
        </section>

        {/* NAVIGATION */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Navigation</h2>
          <div className="mt-4 space-y-4">
            {/* Top Nav */}
            <div className="rounded-[16px] border border-[#A788FA]/15 bg-white px-5 py-3 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F7F7FB] sm:hidden">
                    <Menu size={18} strokeWidth={1.5} className="text-[#2D3748]" />
                  </button>
                  <div className="flex items-center gap-2">
                    <PawPrint size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
                    <span className="font-heading text-base font-bold text-[#6C5CE7]">TabbyFund</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Search size={18} strokeWidth={1.5} className="text-[#2D3748]/60 cursor-pointer hover:text-[#6C5CE7]" />
                  <Bell size={18} strokeWidth={1.5} className="text-[#2D3748]/60 cursor-pointer hover:text-[#6C5CE7]" />
                  <div className="h-8 w-8 rounded-full bg-[#A788FA]/15 flex items-center justify-center">
                    <User size={16} strokeWidth={1.5} className="text-[#6C5CE7]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Detail page header with back button */}
            <div className="rounded-[16px] border border-[#A788FA]/15 bg-white px-5 py-3 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <div className="flex items-center gap-3">
                <button className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F7F7FB]">
                  <ArrowLeft size={18} strokeWidth={1.5} className="text-[#2D3748]" />
                </button>
                <h3 className="text-sm font-semibold text-[#2D3748]">Case Details</h3>
              </div>
            </div>

            {/* Bottom Mobile Nav */}
            <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-3 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <p className="mb-2 px-2 text-[11px] font-medium text-[#2D3748]/60">Mobile Bottom Nav</p>
              <div className="flex items-center justify-around py-1">
                <div className="flex flex-col items-center gap-0.5">
                  <House size={22} strokeWidth={1.5} className="text-[#2D3748]/50" />
                  <span className="text-[10px] text-[#2D3748]/60">Home</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <PawPrint size={22} strokeWidth={1.5} className="text-[#2D3748]/50" />
                  <span className="text-[10px] text-[#2D3748]/60">Feed</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6C5CE7] shadow-[0_2px_8px_rgba(108,92,231,0.3)]">
                    <Plus size={22} strokeWidth={2} className="text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-[#6C5CE7]">Report</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Bell size={22} strokeWidth={1.5} className="text-[#2D3748]/50" />
                  <span className="text-[10px] text-[#2D3748]/60">Activity</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <User size={22} strokeWidth={1.5} className="text-[#6C5CE7]" />
                  <span className="text-[10px] font-medium text-[#6C5CE7]">Profile</span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex rounded-[16px] border border-[#A788FA]/15 overflow-hidden shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <div className="w-52 bg-white border-r border-[#A788FA]/10 p-4 space-y-1">
                <div className="flex items-center gap-2 px-3 mb-4">
                  <PawPrint size={18} strokeWidth={1.5} className="text-[#6C5CE7]" />
                  <span className="font-heading text-sm font-bold text-[#6C5CE7]">TabbyFund</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-[8px] bg-[#6C5CE7]/8 px-3 py-2 text-sm font-medium text-[#6C5CE7]">
                  <House size={16} strokeWidth={1.5} /> Dashboard
                </div>
                <div className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm text-[#2D3748]/70 hover:bg-[#F7F7FB] cursor-pointer">
                  <PawPrint size={16} strokeWidth={1.5} /> Rescue Feed
                </div>
                <div className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm text-[#2D3748]/70 hover:bg-[#F7F7FB] cursor-pointer">
                  <Plus size={16} strokeWidth={1.5} /> Report
                </div>
                <div className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm text-[#2D3748]/70 hover:bg-[#F7F7FB] cursor-pointer">
                  <Heart size={16} strokeWidth={1.5} /> Adopt
                </div>
                <div className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm text-[#2D3748]/70 hover:bg-[#F7F7FB] cursor-pointer">
                  <HandCoins size={16} strokeWidth={1.5} /> Donations
                </div>
                <div className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm text-[#2D3748]/70 hover:bg-[#F7F7FB] cursor-pointer">
                  <Settings size={16} strokeWidth={1.5} /> Settings
                </div>
              </div>
              <div className="flex-1 bg-[#F7F7FB] p-6">
                <p className="text-sm text-[#2D3748]/60">Main content area</p>
              </div>
            </div>
          </div>
        </section>

        {/* DIALOGS */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Dialogs</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <div className="flex items-center gap-2 mb-3">
                <Info size={18} strokeWidth={1.5} className="text-[#6C5CE7]" />
                <h3 className="text-sm font-semibold text-[#2D3748]">Claim Transport?</h3>
              </div>
              <p className="text-xs text-[#2D3748]/70">You will transport this cat to the nearest vet clinic.</p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-[10px] bg-[#6C5CE7] py-2 text-xs font-semibold text-white">Claim</button>
                <button className="flex-1 rounded-[10px] border border-[#A788FA] py-2 text-xs font-semibold text-[#6C5CE7]">Cancel</button>
              </div>
            </div>
            <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)] text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CircleCheck size={24} strokeWidth={1.5} className="text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-[#2D3748]">Report Submitted!</h3>
              <p className="mt-1 text-xs text-[#2D3748]/70">AI is analyzing the case.</p>
              <button className="mt-4 w-full rounded-[10px] bg-[#6C5CE7] py-2 text-xs font-semibold text-white">View Case</button>
            </div>
            <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <div className="flex items-center gap-2 mb-3">
                <Trash2 size={18} strokeWidth={1.5} className="text-red-500" />
                <h3 className="text-sm font-semibold text-[#2D3748]">Cancel Report?</h3>
              </div>
              <p className="text-xs text-[#2D3748]/70">This will permanently remove this rescue case.</p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-[10px] bg-red-500 py-2 text-xs font-semibold text-white">Delete</button>
                <button className="flex-1 rounded-[10px] border border-[#A788FA] py-2 text-xs font-semibold text-[#6C5CE7]">Keep</button>
              </div>
            </div>
          </div>
        </section>

        {/* LOADING */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Loading States</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <p className="text-xs font-medium text-[#2D3748]/60 mb-3">Skeleton</p>
              <div className="space-y-3 animate-pulse">
                <div className="h-28 rounded-[12px] bg-[#A788FA]/10" />
                <div className="h-4 w-3/4 rounded bg-[#A788FA]/10" />
                <div className="h-3 w-full rounded bg-[#A788FA]/8" />
                <div className="flex gap-2 pt-1">
                  <div className="h-8 flex-1 rounded-[8px] bg-[#A788FA]/10" />
                  <div className="h-8 flex-1 rounded-[8px] bg-[#A788FA]/10" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-[16px] border border-[#A788FA]/15 bg-white p-8 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
              <LoaderCircle size={28} strokeWidth={1.5} className="animate-spin text-[#6C5CE7]" />
              <p className="mt-3 text-xs text-[#2D3748]/60">Loading cases...</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)] text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#A788FA]/10 animate-pulse">
                <PawPrint size={24} strokeWidth={1.5} className="text-[#6C5CE7]" />
              </div>
              <p className="text-sm font-medium text-[#2D3748]">Analyzing image...</p>
              <p className="mt-1 text-xs text-[#2D3748]/60">AI is assessing the condition</p>
              <div className="mt-3 h-1.5 w-28 overflow-hidden rounded-full bg-[#A788FA]/15">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-[#6C5CE7]" />
              </div>
            </div>
          </div>
        </section>

        {/* MASCOT USAGE */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Mascot Usage</h2>
          <p className="mt-1 text-xs text-[#2D3748]/70">
            The mascot is the ONLY illustrated element. Everything else uses Lucide icons.
            Gray-and-white tabby, soft and friendly. Used like Duolingo uses Duo.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {([
              { variant: "wave" as const, label: "Welcome", desc: "Landing page greeting", bg: "bg-[#A788FA]/8" },
              { variant: "sleep" as const, label: "Loading", desc: "Sleeping during load", bg: "bg-[#FFF3E0]/60" },
              { variant: "think" as const, label: "AI Thinking", desc: "Processing analysis", bg: "bg-[#A788FA]/8" },
              { variant: "donate" as const, label: "Donation", desc: "Encouraging giving", bg: "bg-[#6C5CE7]/6" },
              { variant: "confused" as const, label: "Empty State", desc: "Nothing found", bg: "bg-[#F7F7FB]" },
              { variant: "happy" as const, label: "Success", desc: "Action completed", bg: "bg-emerald-50" },
              { variant: "celebrate" as const, label: "Celebration", desc: "Rescue milestone", bg: "bg-[#F3C9A6]/15" },
              { variant: "warning" as const, label: "Warning", desc: "Needs attention", bg: "bg-[#F3C9A6]/20" },
              { variant: "love" as const, label: "Adoption", desc: "Found a home", bg: "bg-pink-50" },
              { variant: "shy" as const, label: "Onboarding", desc: "First-time user", bg: "bg-[#A788FA]/8" },
              { variant: "sad" as const, label: "Error", desc: "Something went wrong", bg: "bg-red-50" },
              { variant: "default" as const, label: "Default", desc: "General branding", bg: "bg-[#F7F7FB]" },
            ]).map((m) => (
              <div key={m.variant} className={`flex flex-col items-center rounded-[12px] ${m.bg} p-4 text-center border border-[#A788FA]/10`}>
                <TabbyMascot variant={m.variant} size="md" />
                <p className="mt-2 text-xs font-semibold text-[#2D3748]">{m.label}</p>
                <p className="text-[10px] text-[#2D3748]/60">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
            <p className="mb-3 text-xs font-medium text-[#2D3748]/60">Size Variants</p>
            <div className="flex items-end gap-6">
              <div className="flex flex-col items-center gap-1">
                <TabbyMascot variant="wave" size="sm" />
                <span className="text-[10px] text-[#2D3748]/60">sm (32px)</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <TabbyMascot variant="wave" size="md" />
                <span className="text-[10px] text-[#2D3748]/60">md (64px)</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <TabbyMascot variant="wave" size="lg" />
                <span className="text-[10px] text-[#2D3748]/60">lg (96px)</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <TabbyMascot variant="wave" size="xl" />
                <span className="text-[10px] text-[#2D3748]/60">xl (128px)</span>
              </div>
            </div>
          </div>
        </section>

        {/* LAYOUT EXAMPLES */}
        <section>
          <h2 className="font-heading text-lg font-semibold text-[#6C5CE7]">Layout Examples</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {/* Mobile */}
            <div>
              <p className="mb-2 text-xs font-medium text-[#2D3748]/60">Mobile (375px)</p>
              <div className="mx-auto w-[300px] rounded-[20px] border-2 border-[#2D3748]/15 bg-[#F7F7FB] p-2.5">
                <div className="rounded-[14px] bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <PawPrint size={14} strokeWidth={1.5} className="text-[#6C5CE7]" />
                      <span className="font-heading text-xs font-bold text-[#6C5CE7]">TabbyFund</span>
                    </div>
                    <Bell size={14} strokeWidth={1.5} className="text-[#2D3748]/40" />
                  </div>
                  <div className="h-20 rounded-[10px] bg-gradient-to-br from-[#F7F7FB] to-[#A788FA]/10 flex items-center justify-center mb-2">
                    <PawPrint size={24} strokeWidth={1.5} className="text-[#A788FA]/30" />
                  </div>
                  <div className="h-2.5 w-3/4 rounded bg-[#2D3748]/8 mb-1.5" />
                  <div className="h-2 w-full rounded bg-[#2D3748]/5 mb-1" />
                  <div className="h-2 w-2/3 rounded bg-[#2D3748]/5" />
                </div>
                <div className="mt-2 flex items-center justify-around rounded-[10px] bg-white py-2">
                  <House size={16} strokeWidth={1.5} className="text-[#2D3748]/40" />
                  <PawPrint size={16} strokeWidth={1.5} className="text-[#2D3748]/40" />
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6C5CE7]">
                    <Plus size={16} strokeWidth={2} className="text-white" />
                  </div>
                  <Bell size={16} strokeWidth={1.5} className="text-[#2D3748]/40" />
                  <User size={16} strokeWidth={1.5} className="text-[#6C5CE7]" />
                </div>
              </div>
            </div>

            {/* Desktop Grid */}
            <div>
              <p className="mb-2 text-xs font-medium text-[#2D3748]/60">Desktop Card Grid</p>
              <div className="rounded-[16px] border border-[#A788FA]/15 bg-[#F7F7FB] p-5">
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="rounded-[12px] bg-white p-3 shadow-sm border border-[#A788FA]/8">
                      <div className="h-14 rounded-[8px] bg-gradient-to-br from-[#F7F7FB] to-[#A788FA]/10 flex items-center justify-center mb-2">
                        <PawPrint size={16} strokeWidth={1.5} className="text-[#A788FA]/30" />
                      </div>
                      <div className="h-2 w-3/4 rounded bg-[#2D3748]/8 mb-1" />
                      <div className="h-1.5 w-full rounded bg-[#2D3748]/5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-4 text-center">
          <p className="text-xs text-[#2D3748]/50">
            Design System Preview · TabbyFund · Use only these colors, Lucide icons, and the official mascot.
          </p>
        </footer>
      </div>
    </div>
  );
}
