import { getProfile } from "@/lib/supabase/auth-helpers";
import { redirect } from "next/navigation";
import { PawPrint, HandCoins, Truck, Heart, Calendar } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Profile — TabbyFund",
};

const stats = [
  { icon: PawPrint, label: "Rescues Reported", value: 3 },
  { icon: HandCoins, label: "Total Donated", value: "฿5,200" },
  { icon: Truck, label: "Transport Missions", value: 2 },
  { icon: Heart, label: "Cats Adopted", value: 0 },
];

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) redirect("/profile-error");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Profile card */}
      <div className="flex flex-col items-center rounded-[16px] border border-[#A788FA]/15 bg-white p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)] text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#6C5CE7]/10 text-2xl font-bold text-[#6C5CE7]">
          {profile.display_name.charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-3 font-heading text-xl font-bold text-[#2D3748]">{profile.display_name}</h1>
        <Badge variant="secondary" className="mt-1 bg-[#6C5CE7]/10 text-[#6C5CE7] border-0 uppercase text-[10px] font-semibold">
          {profile.role}{profile.role === "vet" && profile.is_verified ? " · verified" : ""}
        </Badge>
        <p className="mt-2 flex items-center gap-1 text-xs text-[#2D3748]/50">
          <Calendar size={12} strokeWidth={1.5} /> Joined {new Date(profile.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center rounded-[14px] border border-[#A788FA]/15 bg-white p-4 shadow-[0_2px_12px_rgba(108,92,231,0.06)]">
            <s.icon size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
            <p className="mt-2 text-lg font-bold text-[#2D3748]">{s.value}</p>
            <p className="text-[9px] text-[#2D3748]/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Achievements placeholder */}
      <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <h3 className="text-sm font-semibold text-[#2D3748] mb-3">Achievements</h3>
        <div className="flex items-center gap-4 text-center">
          <TabbyMascot variant="happy" size="sm" />
          <p className="text-xs text-[#2D3748]/60">Achievements are coming soon! Keep rescuing cats to unlock badges.</p>
        </div>
      </div>
    </div>
  );
}
