interface VetFinancialOverviewProps {
  pendingEscrow: number;
  releasedEarnings: number;
}

export function VetFinancialOverview({ pendingEscrow, releasedEarnings }: VetFinancialOverviewProps) {
  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-slate-50/50 p-5 shadow-[0_4px_20px_rgba(108,92,231,0.04)]">
      <h3 className="text-[10px] font-bold text-[#2D3748]/60 uppercase tracking-wider mb-3 pl-1">
        Financial Overview
      </h3>
      <div className="grid grid-cols-2 gap-4 divide-x divide-[#2D3748]/5">
        <div className="pl-1 space-y-1">
          <span className="block text-[9px] font-bold text-[#2D3748]/50 uppercase tracking-wider">
            Pending Escrow
          </span>
          <p className="text-lg font-bold text-amber-600">
            ฿{pendingEscrow.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#2D3748]/45 leading-normal max-w-sm">
            Held in escrow awaiting donation completion OR recovery confirmation.
          </p>
        </div>
        <div className="pl-5 space-y-1">
          <span className="block text-[9px] font-bold text-[#2D3748]/50 uppercase tracking-wider">
            Released Earnings
          </span>
          <p className="text-lg font-bold text-emerald-600">
            ฿{releasedEarnings.toLocaleString()}
          </p>
          <p className="text-[10px] text-[#2D3748]/45 leading-normal max-w-sm">
            Total payouts successfully released to your clinic.
          </p>
        </div>
      </div>
    </div>
  );
}