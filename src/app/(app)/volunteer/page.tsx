import { Truck, Home, Heart } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import { TransportVolunteerCard } from "@/features/volunteer/components/TransportVolunteerCard";
import { CaretakerVolunteerCard } from "@/features/volunteer/components/CaretakerNeedCard";
import { getTransportNeeded, getCaretakerNeeded } from "@/lib/volunteer";

export const metadata = {
  title: "Volunteer — TabbyFund",
};

/**
 * /volunteer — One clear place for community users to help.
 * Shows transport needs and caretaker needs from real data.
 */
export default async function VolunteerPage() {
  const [transportCases, caretakerCases] = await Promise.all([
    getTransportNeeded(),
    getCaretakerNeeded(),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <div className="flex items-center gap-4 rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <TabbyMascot variant="wave" size="lg" />
        <div>
          <h1 className="font-heading text-xl font-bold text-[#2D3748]">
            Help Now
          </h1>
          <p className="mt-1 text-sm text-[#2D3748]/60">
            Rescued cats need your help. Transport them to safety or care for them while they await adoption.
          </p>
        </div>
      </div>

      {/* Transport Needed */}
      <div>
        <div className="mb-2">
          <h2 className="font-heading text-sm font-semibold text-[#2D3748]">Transport Needed</h2>
          <p className="text-xs text-[#2D3748]/60 mt-0.5">Help transport rescued cats safely to their assigned veterinarian.</p>
        </div>
        {transportCases.length === 0 ? (
          <div className="flex flex-col items-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-8 text-center space-y-3">
            <TabbyMascot variant="sleep" size="lg" className="opacity-75" />
            <div>
              <p className="text-sm font-bold text-[#6C5CE7]">Great news!</p>
              <p className="text-xs font-medium text-[#2D3748]/70 mt-0.5">There are currently no cats waiting for transport to the vet.</p>
              <p className="text-[10px] text-[#2D3748]/40 mt-0.5">Thank you for checking in! All rescued cats are currently safe at clinics.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {transportCases.map((c) => (
              <TransportVolunteerCard key={c.id} caseData={c} />
            ))}
          </div>
        )}
      </div>

      {/* Temporary Caretaker Needed */}
      <div className="pt-2">
        <div className="mb-2">
          <h2 className="font-heading text-sm font-semibold text-[#2D3748]">Temporary Caretaker Needed</h2>
          <p className="text-xs text-[#2D3748]/60 mt-0.5">These cats have completed treatment and are waiting for temporary foster care before adoption.</p>
        </div>
        {caretakerCases.length === 0 ? (
          <div className="flex flex-col items-center rounded-[16px] border border-dashed border-[#A788FA]/20 bg-white p-8 text-center space-y-3">
            <TabbyMascot variant="happy" size="lg" className="opacity-75" />
            <div>
              <p className="text-sm font-bold text-[#6C5CE7]">Great news!</p>
              <p className="text-xs font-medium text-[#2D3748]/70 mt-0.5">There are currently no cats waiting for temporary foster care.</p>
              <p className="text-[10px] text-[#2D3748]/40 mt-0.5">All recovering cats are settled in warm foster homes.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {caretakerCases.map((c) => (
              <CaretakerVolunteerCard key={c.id} caseData={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
