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
      <DashboardSection title="Transport Needed" viewAllHref="/cases?status=AWAITING_TRANSPORT">
        {transportCases.length === 0 ? (
          <div className="flex flex-col items-center rounded-[14px] border border-dashed border-[#A788FA]/20 bg-white p-8 text-center">
            <Truck size={32} strokeWidth={1} className="text-[#A788FA]/30 mb-2" />
            <p className="text-xs text-[#2D3748]/50">No cats need transport right now</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transportCases.map((c) => (
              <TransportVolunteerCard key={c.id} caseData={c} />
            ))}
          </div>
        )}
      </DashboardSection>

      {/* Temporary Caretaker Needed */}
      <DashboardSection title="Temporary Caretaker Needed" viewAllHref="/cases">
        {caretakerCases.length === 0 ? (
          <div className="flex flex-col items-center rounded-[14px] border border-dashed border-[#A788FA]/20 bg-white p-8 text-center">
            <Home size={32} strokeWidth={1} className="text-[#A788FA]/30 mb-2" />
            <p className="text-xs text-[#2D3748]/50">No cats need a temporary caretaker right now</p>
          </div>
        ) : (
          <div className="space-y-3">
            {caretakerCases.map((c) => (
              <CaretakerVolunteerCard key={c.id} caseData={c} />
            ))}
          </div>
        )}
      </DashboardSection>
    </div>
  );
}
