"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  className?: string;
  align?: "left" | "right";
  widthClass?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  className = "",
  align = "left",
  widthClass = "w-48",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-full items-center justify-between gap-1.5 rounded-[10px] border border-[#A788FA]/15 bg-[#F7F7FB] px-3 text-xs text-[#2D3748] hover:border-[#6C5CE7]/30 transition focus:outline-none"
      >
        <span className="truncate">{selectedOption?.label || "Select..."}</span>
        <ChevronDown size={14} className={`text-[#2D3748]/40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-1.5 ${widthClass} rounded-[12px] border border-[#A788FA]/15 bg-white p-1 shadow-[0_10px_30px_rgba(108,92,231,0.08)] focus:outline-none z-50 animate-in fade-in slide-in-from-top-1 duration-100 max-h-60 overflow-y-auto`}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-[8px] px-2.5 py-1.5 text-left text-xs transition ${
                  isSelected
                    ? "bg-[#6C5CE7]/10 text-[#6C5CE7] font-semibold"
                    : "text-[#2D3748]/80 hover:bg-slate-50 hover:text-[#2D3748]"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check size={12} className="text-[#6C5CE7]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
