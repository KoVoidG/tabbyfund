"use client";

interface DetailsData {
  notes: string;
  approximateAge: string;
  visibleInjuries: string;
  behaviour: string;
}

interface RescueDetailsFormProps {
  details?: DetailsData;
  onDetailsChange: (details: DetailsData) => void;
}

/**
 * RescueDetailsForm — Step 4 of the rescue wizard.
 * Short friendly form: notes, age, injuries, behaviour.
 */
export function RescueDetailsForm({ details, onDetailsChange }: RescueDetailsFormProps) {
  const current: DetailsData = details ?? {
    notes: "",
    approximateAge: "",
    visibleInjuries: "",
    behaviour: "",
  };

  function update(field: keyof DetailsData, value: string) {
    onDetailsChange({ ...current, [field]: value });
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-base font-semibold text-[#2D3748]">
          Tell us more
        </h2>
        <p className="mt-1 text-sm text-[#2D3748]/60">
          Any details help volunteers rescue this cat faster.
        </p>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="rescue-notes" className="mb-1.5 block text-sm font-medium text-[#2D3748]">
          What did you see? <span className="text-red-500">*</span>
        </label>
        <textarea
          id="rescue-notes"
          rows={3}
          placeholder="Describe the situation briefly..."
          value={current.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 py-3 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15 resize-none"
        />
      </div>

      {/* Age */}
      <div>
        <label htmlFor="rescue-age" className="mb-1.5 block text-sm font-medium text-[#2D3748]">
          Approximate age
        </label>
        <select
          id="rescue-age"
          value={current.approximateAge}
          onChange={(e) => update("approximateAge", e.target.value)}
          className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 text-sm text-[#2D3748] focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15"
        >
          <option value="">Not sure</option>
          <option value="kitten">Kitten (under 6 months)</option>
          <option value="young">Young (6 months – 2 years)</option>
          <option value="adult">Adult (2–8 years)</option>
          <option value="senior">Senior (8+ years)</option>
        </select>
      </div>

      {/* Injuries */}
      <div>
        <label htmlFor="rescue-injuries" className="mb-1.5 block text-sm font-medium text-[#2D3748]">
          Visible injuries
        </label>
        <input
          id="rescue-injuries"
          type="text"
          placeholder="e.g. bleeding leg, swollen eye"
          value={current.visibleInjuries}
          onChange={(e) => update("visibleInjuries", e.target.value)}
          className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15"
        />
      </div>

      {/* Behaviour */}
      <div>
        <label htmlFor="rescue-behaviour" className="mb-1.5 block text-sm font-medium text-[#2D3748]">
          Cat behaviour
        </label>
        <select
          id="rescue-behaviour"
          value={current.behaviour}
          onChange={(e) => update("behaviour", e.target.value)}
          className="h-11 w-full rounded-[12px] border border-[#A788FA]/20 bg-white px-4 text-sm text-[#2D3748] focus:border-[#6C5CE7] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15"
        >
          <option value="">Select...</option>
          <option value="immobile">Cannot move / lying down</option>
          <option value="scared">Scared / hiding</option>
          <option value="approachable">Approachable / friendly</option>
          <option value="aggressive">Aggressive / hissing</option>
          <option value="lethargic">Lethargic / weak</option>
        </select>
      </div>
    </div>
  );
}
