"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, FileText, Send, LoaderCircle } from "lucide-react";
import { submitVetQuote } from "../actions";

interface QuoteItem {
  id: string;
  name: string;
  cost: number;
  notes: string;
}

interface QuoteBuilderProps {
  caseId: string;
}

/**
 * QuoteBuilder — multi-item treatment quote with live running total.
 * Allows adding/removing items, each with name, cost, and optional notes.
 * Submits a real vet quote to Supabase.
 */
export function QuoteBuilder({ caseId }: QuoteBuilderProps) {
  const [items, setItems] = useState<QuoteItem[]>([
    { id: "1", name: "", cost: 0, notes: "" },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const total = items.reduce((sum, item) => sum + (item.cost || 0), 0);

  function addItem() {
    setItems([...items, { id: Date.now().toString(), name: "", cost: 0, notes: "" }]);
  }

  function removeItem(id: string) {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  }

  function updateItem(id: string, field: keyof QuoteItem, value: string | number) {
    setItems(items.map((i) => i.id === id ? { ...i, [field]: value } : i));
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      // Build notes from all items
      const notesText = items
        .filter((i) => i.name)
        .map((i) => `${i.name}: ฿${i.cost.toLocaleString()}${i.notes ? ` (${i.notes})` : ""}`)
        .join(". ");

      const result = await submitVetQuote({
        caseId,
        amount: total,
        notes: notesText || `Treatment quote: ฿${total.toLocaleString()}`,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error ?? "Failed to submit quote.");
      }
    });
  }

  return (
    <div className="rounded-[16px] border border-[#A788FA]/15 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(108,92,231,0.08)]">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-[#2D3748] mb-4">
        <FileText size={16} strokeWidth={1.5} className="text-[#6C5CE7]" /> Treatment Quote
      </h3>

      {submitted ? (
        <div className="text-center py-6">
          <p className="text-sm font-semibold text-emerald-600">Quote submitted! ✓</p>
          <p className="mt-1 text-xs text-[#2D3748]/60">Funding will open for ฿{total.toLocaleString()}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-2 items-start">
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Item name (e.g. X-Ray)"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    className="h-9 flex-1 rounded-[10px] border border-[#A788FA]/20 bg-white px-3 text-xs text-[#2D3748] placeholder:text-[#2D3748]/40 focus:border-[#6C5CE7] focus:outline-none"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#A788FA]">฿</span>
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={item.cost || ""}
                      onChange={(e) => updateItem(item.id, "cost", parseInt(e.target.value) || 0)}
                      className="h-9 w-full rounded-[10px] border border-[#A788FA]/20 bg-white pl-6 pr-2 text-xs text-[#2D3748] focus:border-[#6C5CE7] focus:outline-none"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Notes (optional)"
                  value={item.notes}
                  onChange={(e) => updateItem(item.id, "notes", e.target.value)}
                  className="h-8 w-full rounded-[8px] border border-[#A788FA]/10 bg-[#F7F7FB] px-3 text-[10px] text-[#2D3748]/70 placeholder:text-[#2D3748]/30 focus:border-[#6C5CE7] focus:outline-none"
                />
              </div>
              <button
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 1}
                className="mt-1 flex h-7 w-7 items-center justify-center rounded-[6px] text-[#2D3748]/30 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-0"
              >
                <Trash2 size={13} strokeWidth={1.5} />
              </button>
            </div>
          ))}

          {/* Add item */}
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 rounded-[8px] px-3 py-2 text-xs font-medium text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition"
          >
            <Plus size={13} strokeWidth={1.5} /> Add Item
          </button>

          {/* Total */}
          <div className="flex items-center justify-between rounded-[10px] bg-[#F7F7FB] px-4 py-3 border border-[#A788FA]/10">
            <span className="text-xs font-medium text-[#2D3748]/60">Total Quote</span>
            <span className="text-lg font-bold text-[#6C5CE7]">฿{total.toLocaleString()}</span>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-[10px] bg-red-50 border border-red-200 p-3">
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={total === 0 || !items.some((i) => i.name) || isPending}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition hover:bg-[#A788FA] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <><LoaderCircle size={14} strokeWidth={2} className="animate-spin" /> Submitting...</>
            ) : (
              <><Send size={14} strokeWidth={1.5} /> Submit Quote</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
