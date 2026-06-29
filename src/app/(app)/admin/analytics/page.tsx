"use client";

import { BarChart3, TrendingUp, Heart, PawPrint, HandCoins, Users } from "lucide-react";
import { AnalyticsCard } from "@/features/admin/components/AnalyticsCard";
import { monthlyRescues, donationGrowth } from "@/features/admin/mock-data";

const adoptionRate = [
  { month: "Jan", count: 0 },
  { month: "Feb", count: 1 },
  { month: "Mar", count: 0 },
  { month: "Apr", count: 1 },
  { month: "May", count: 2 },
  { month: "Jun", count: 1 },
];

const volunteerActivity = [
  { month: "Jan", count: 4 },
  { month: "Feb", count: 6 },
  { month: "Mar", count: 5 },
  { month: "Apr", count: 8 },
  { month: "May", count: 7 },
  { month: "Jun", count: 12 },
];

const treatmentSuccess = [
  { month: "Jan", count: 80 },
  { month: "Feb", count: 85 },
  { month: "Mar", count: 90 },
  { month: "Apr", count: 88 },
  { month: "May", count: 92 },
  { month: "Jun", count: 95 },
];

const fundingDistribution = [
  { month: "Surgery", count: 45 },
  { month: "Meds", count: 25 },
  { month: "ICU", count: 15 },
  { month: "Follow-up", count: 10 },
  { month: "Other", count: 5 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <BarChart3 size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-[#2D3748]">Platform Analytics</h1>
          <p className="text-xs text-[#2D3748]/60">Insights into rescue operations and community impact</p>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <AnalyticsCard title="Monthly Rescues" data={monthlyRescues} valueKey="count" formatType="count" />
        <AnalyticsCard title="Donation Growth (฿)" data={donationGrowth} valueKey="amount" formatType="currency" color="#10B981" />
        <AnalyticsCard title="Adoption Rate" data={adoptionRate} valueKey="count" formatType="count" color="#EC4899" />
        <AnalyticsCard title="Volunteer Activity" data={volunteerActivity} valueKey="count" formatType="count" color="#3B82F6" />
        <AnalyticsCard title="Treatment Success (%)" data={treatmentSuccess} valueKey="count" formatType="percent" color="#10B981" />
        <AnalyticsCard title="Funding Distribution (%)" data={fundingDistribution} valueKey="count" formatType="percent" color="#F59E0B" />
      </div>
    </div>
  );
}
