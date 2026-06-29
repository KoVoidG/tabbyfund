"use client";

import { useState } from "react";
import { Truck, Clock, CircleCheck, User } from "lucide-react";

interface TransportCardProps {
  status: "OPEN" | "CLAIMED" | "DELIVERED";
  transporter?: string;
}

const statusConfig = {
  OPEN: { color: "text-orange-600", bg: "bg-orange-100", label: "Awaiting Volunteer", icon: Clock },
  CLAIMED: { color: "text-blue-600", bg: "bg-blue-100", label: "In Transit", icon: Truck },
  DELIVERED: { color: "text-emerald-600", bg: "bg-emerald-100", label: "Delivered to Vet", icon: CircleCheck },
};

/**
 * TransportCard — shows transport status with claim action (mock).
 */
export function TransportCard({ status: initialStatus, transporter: initialTransporter }: TransportCardProps) {
  const [status, setStatus] = useState(initialStatus);
  const [transporter, setTransporter] = useState(initialTransporter);

  const config = statusConfig[status];
  const Icon = config.icon;

  function handleClaim() {
    setStatus("CLAIMED");
    setTransporter("You");
  }

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)] transition-shadow hover:shadow-[0_8px_28px_rgba(108,92,231,0.12)]">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold text-[#2D3748] mb-3">
        <Truck size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Transport
      </h3>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bg}`}>
          <Icon size={18} strokeWidth={1.5} className={config.color} />
        </div>
        <div>
          <p className={`text-sm font-semibold ${config.color}`}>{config.label}</p>
          {transporter && (
            <p className="flex items-center gap-1 text-xs text-[#2D3748]/60 mt-0.5">
              <User size={11} strokeWidth={1.5} /> {transporter}
            </p>
          )}
          {status === "OPEN" && (
            <button
              onClick={handleClaim}
              className="mt-2 rounded-[10px] bg-[#6C5CE7] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#A788FA] transition-colors"
            >
              Volunteer to Transport
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
