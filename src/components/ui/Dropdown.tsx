"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface DropdownProps {
  /** Element that triggers the dropdown */
  trigger: ReactNode;
  /** Dropdown menu items */
  children: ReactNode;
  /** Alignment of the dropdown panel relative to the trigger */
  align?: "left" | "right";
  /** Optional custom width class (defaults to w-56) */
  widthClass?: string;
  /** Custom classes for wrapper */
  className?: string;
}

export function Dropdown({ trigger, children, align = "right", widthClass = "w-56", className = "" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={toggle} className="cursor-pointer select-none">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 ${widthClass} origin-top-right rounded-[12px] border border-[#A788FA]/15 bg-white p-1.5 shadow-[0_10px_30px_rgba(108,92,231,0.15)] focus:outline-none z-50 animate-in fade-in slide-in-from-top-2 duration-100`}
        >
          <div className="space-y-0.5" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
