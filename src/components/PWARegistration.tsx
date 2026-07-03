"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export function PWARegistration() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window.location.protocol === "https:" || window.location.hostname === "localhost")
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[sw] Registered with scope:", reg.scope);
        })
        .catch((err) => {
          console.error("[sw] Registration failed:", err);
        });
    }

    // 2. Capture Install Prompt Event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[pwa] User choice outcome: ${outcome}`);
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-[16px] border border-[#A788FA]/20 bg-white p-4 shadow-[0_10px_30px_rgba(108,92,231,0.15)] flex items-center justify-between sm:left-auto sm:right-4 sm:w-80">
      <div className="flex flex-col pr-4">
        <span className="font-heading text-xs font-bold text-[#2D3748]">Install TabbyFund App</span>
        <span className="text-[10px] text-[#2D3748]/60 mt-0.5">Access cat rescue updates instantly from your home screen.</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1 rounded-[10px] bg-[#6C5CE7] px-3.5 py-2 text-[10px] font-bold text-white hover:bg-[#A788FA] transition shadow-sm"
        >
          <Download size={11} strokeWidth={2.5} /> Install
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#2D3748]/45 hover:bg-[#F7F7FB] transition"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
