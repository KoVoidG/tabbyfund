"use client";

import { useState, useEffect, useCallback } from "react";

const DRAFT_KEY = "tabbyfund_rescue_draft";

export interface RescueDraft {
  /** Public URL of the uploaded photo in Supabase Storage */
  photoUrl?: string;
  /** Storage path for cleanup (e.g., "{user_id}/{timestamp}.jpg") */
  storagePath?: string;
  /** Local blob URL for instant preview */
  previewUrl?: string;
  aiResult?: {
    severity: string;
    confidence: number;
    condition: string;
    reasoning: string;
    firstAid: string[];
    urgency?: string;
    estimatedRecovery?: string;
    recommendedAction?: string;
    recoveryConfidence?: number;
  };
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  details?: {
    notes: string;
    approximateAge: string;
    visibleInjuries: string;
    behaviour: string;
  };
  /** Whether the reporter can transport the cat themselves */
  canTransport?: boolean;
  currentStep: number;
  lastSaved?: string;
}

const emptyDraft: RescueDraft = { currentStep: 0 };

/**
 * useRescueDraft — localStorage-based draft persistence for the rescue wizard.
 *
 * Saves after each step. Restores on mount.
 * Structure is ready to be swapped with backend draft API later.
 */
export function useRescueDraft() {
  const [draft, setDraft] = useState<RescueDraft>(emptyDraft);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RescueDraft;
        if (parsed.currentStep > 0 || parsed.photoUrl) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setDraft(parsed);
          setHasSavedDraft(true);
        }
      }
    } catch {
      // Ignore corrupted storage
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever draft changes
  const saveDraft = useCallback((updates: Partial<RescueDraft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...updates, lastSaved: new Date().toISOString() };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      } catch {
        // Storage full — silently fail for MVP
      }
      return next;
    });
  }, []);

  const clearDraft = useCallback(() => {
    setDraft(emptyDraft);
    setHasSavedDraft(false);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const discardDraft = useCallback(() => {
    clearDraft();
  }, [clearDraft]);

  return { draft, saveDraft, clearDraft, discardDraft, hasSavedDraft, isLoaded };
}
