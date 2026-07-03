"use client";

import { TabbyMascot } from "@/components/branding/TabbyMascot";

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F7F7FB] p-6 text-center">
      <title>Offline | TabbyFund</title>
      <div className="max-w-md space-y-6">
        <div className="flex justify-center">
          <TabbyMascot variant="sleep" size="xl" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-[#2D3748]">
            Connection Lost
          </h1>
          <p className="text-sm text-[#2D3748]/60">
            TabbyFund requires an internet connection to load new data, perform AI visual triage, or check map coordinates.
          </p>
        </div>
        <div className="rounded-[12px] border border-[#A788FA]/10 bg-white p-4 text-left shadow-[0_4px_20px_rgba(108,92,231,0.04)]">
          <h2 className="text-xs font-semibold text-[#2D3748] mb-1">
            Offline Capabilities:
          </h2>
          <ul className="list-disc pl-4 text-xs text-[#2D3748]/70 space-y-1">
            <li>You can still view previously visited cases.</li>
            <li>Photos and geocoding will load automatically once you reconnect.</li>
          </ul>
        </div>
        <button
          onClick={handleReload}
          className="w-full rounded-[12px] bg-[#6C5CE7] py-3 text-sm font-semibold text-white shadow-md hover:bg-[#A788FA] transition cursor-pointer"
        >
          Try Reconnecting
        </button>
      </div>
    </div>
  );
}
