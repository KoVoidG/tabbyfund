/**
 * Shared types for case UI components.
 * These are the canonical types that components import — backed by real DB enums.
 */
import type { Enums } from "@/types/database";

export type CaseStatus = Enums<"case_status">;
export type Severity = Enums<"ai_severity">;
