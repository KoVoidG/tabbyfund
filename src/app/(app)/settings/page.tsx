"use client";

import { useState } from "react";
import { Settings, Bell, Moon, Accessibility, Info } from "lucide-react";

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-[#2D3748]">{label}</p>
        <p className="text-[11px] text-[#2D3748]/50">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-[#6C5CE7]" : "bg-[#A788FA]/20"}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [transportAlerts, setTransportAlerts] = useState(true);
  const [donationUpdates, setDonationUpdates] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C5CE7]/8">
          <Settings size={20} strokeWidth={1.5} className="text-[#6C5CE7]" />
        </div>
        <h1 className="font-heading text-lg font-bold text-[#2D3748]">Settings</h1>
      </div>

      {/* Appearance */}
      <section className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748] mb-1">
          <Moon size={14} strokeWidth={1.5} className="text-[#6C5CE7]" /> Appearance
        </h2>
        <div className="divide-y divide-[#A788FA]/5">
          <Toggle label="Dark Mode" description="Switch to dark theme" checked={darkMode} onChange={setDarkMode} />
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748] mb-1">
          <Bell size={14} strokeWidth={1.5} className="text-[#6C5CE7]" /> Notifications
        </h2>
        <div className="divide-y divide-[#A788FA]/5">
          <Toggle label="Email Notifications" description="Receive updates via email" checked={emailNotif} onChange={setEmailNotif} />
          <Toggle label="Push Notifications" description="Browser push alerts" checked={pushNotif} onChange={setPushNotif} />
          <Toggle label="Transport Alerts" description="When a rescue needs transport" checked={transportAlerts} onChange={setTransportAlerts} />
          <Toggle label="Donation Updates" description="When cases you donated to update" checked={donationUpdates} onChange={setDonationUpdates} />
        </div>
      </section>

      {/* Accessibility */}
      <section className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748] mb-1">
          <Accessibility size={14} strokeWidth={1.5} className="text-[#6C5CE7]" /> Accessibility
        </h2>
        <div className="divide-y divide-[#A788FA]/5">
          <Toggle label="Reduce Motion" description="Minimize animations" checked={reduceMotion} onChange={setReduceMotion} />
        </div>
      </section>

      {/* About */}
      <section className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748] mb-2">
          <Info size={14} strokeWidth={1.5} className="text-[#6C5CE7]" /> About
        </h2>
        <div className="text-xs text-[#2D3748]/60 space-y-1">
          <p>TabbyFund v0.1.0 — Hackathon MVP</p>
          <p>Community-powered cat rescue platform</p>
        </div>
      </section>
    </div>
  );
}
