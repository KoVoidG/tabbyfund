"use client";

import { useState } from "react";
import { Stethoscope, Save } from "lucide-react";

/**
 * DiagnosisCard — veterinary examination form.
 * Diagnosis, clinical notes, severity override, recovery time, recommended treatment.
 */
export function DiagnosisCard() {
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [severity, setSeverity] = useState("HIGH");
  const [recoveryTime, setRecoveryTime] = useState("");
  const [treatment, setTreatment] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748] mb-4">
        <Stethoscope size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Veterinary Examination
      </h3>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#2D3748]">Diagnosis</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g. Compound fracture of left hind leg"
            className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#2D3748]">Clinical Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detailed observations..."
            className="w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 py-3 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#2D3748]">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 text-sm text-[#2D3748] focus:border-[#6C5CE7] focus:outline-none"
            >
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#2D3748]">Est. Recovery</label>
            <input
              type="text"
              value={recoveryTime}
              onChange={(e) => setRecoveryTime(e.target.value)}
              placeholder="e.g. 3 weeks"
              className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#2D3748]">Recommended Treatment</label>
          <textarea
            rows={2}
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Brief treatment plan..."
            className="w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 py-3 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15 resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          className="flex h-10 items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] px-5 text-sm font-semibold text-white transition hover:bg-[#A788FA]"
        >
          <Save size={14} strokeWidth={1.5} />
          {saved ? "Saved ✓" : "Save Examination"}
        </button>
      </div>
    </div>
  );
}
