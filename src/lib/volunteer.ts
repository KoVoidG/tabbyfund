import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";

export interface TransportNeededCase {
  id: string;
  photo: string;
  description: string;
  severity: string;
  location: string;
  timeAgo: string;
}

export interface CaretakerNeededCase {
  id: string;
  photo: string;
  condition: string;
  description: string;
  timeAgo: string;
}

/**
 * Get cases needing transport (transport_requests.status = OPEN).
 *
 * Uses service_role for cases table read (community users cannot
 * SELECT arbitrary cases via RLS). Only public-safe fields selected:
 * id, photo_url, description, ai_severity, fuzzed_lat, fuzzed_lng, created_at.
 * NEVER selects precise_lat/precise_lng.
 */
export async function getTransportNeeded(): Promise<TransportNeededCase[]> {
  const supabase = await createClient();
  const { createServiceClient } = await import("@/lib/supabase/service");
  const caseReader = createServiceClient();

  // transport_requests SELECT is open to all authenticated users
  const { data } = await supabase
    .from("transport_requests")
    .select("case_id")
    .eq("status", "OPEN");

  if (!data || data.length === 0) return [];

  const caseIds = data.map((t) => t.case_id);

  // Use service_role for cases (restrictive SELECT RLS)
  const { data: cases } = await caseReader
    .from("cases")
    .select("id, photo_url, description, ai_severity, fuzzed_lat, fuzzed_lng, created_at")
    .in("id", caseIds)
    .order("created_at", { ascending: false });

  if (!cases) return [];

  return cases.map((c) => ({
    id: c.id,
    photo: c.photo_url,
    description: c.description,
    severity: c.ai_severity ?? "MEDIUM",
    location: `${c.fuzzed_lat.toFixed(3)}°N, ${c.fuzzed_lng.toFixed(3)}°E`,
    timeAgo: formatDistanceToNow(new Date(c.created_at), { addSuffix: true }),
  }));
}

/**
 * Get cases needing a temporary caretaker.
 * Conditions: TREATED/FUNDS_RELEASED + ready_for_adoption = true + no active foster.
 *
 * Uses service_role for cases table read (same reason as above).
 * Only public-safe fields selected. No precise coordinates.
 */
export async function getCaretakerNeeded(): Promise<CaretakerNeededCase[]> {
  const supabase = await createClient();
  const { createServiceClient } = await import("@/lib/supabase/service");
  const caseReader = createServiceClient();

  // treatment_records SELECT is open to all authenticated users
  const { data: treatments } = await supabase
    .from("treatment_records")
    .select("case_id")
    .eq("ready_for_adoption", true)
    .eq("outcome", "RECOVERED");

  if (!treatments || treatments.length === 0) return [];

  const treatmentCaseIds = treatments.map((t) => t.case_id);

  // Use service_role for cases (restrictive SELECT RLS)
  const { data: cases } = await caseReader
    .from("cases")
    .select("id, photo_url, description, ai_condition, created_at, status")
    .in("id", treatmentCaseIds)
    .in("status", ["TREATED", "FUNDS_RELEASED"]);

  if (!cases || cases.length === 0) return [];

  // foster_records SELECT is open to all authenticated users
  const { data: activeFosters } = await supabase
    .from("foster_records")
    .select("case_id")
    .eq("status", "ACTIVE")
    .in("case_id", cases.map((c) => c.id));

  const fosterCaseIds = new Set((activeFosters ?? []).map((f) => f.case_id));
  const needsCaretaker = cases.filter((c) => !fosterCaseIds.has(c.id));

  return needsCaretaker.map((c) => ({
    id: c.id,
    photo: c.photo_url,
    condition: c.ai_condition ?? "Recovered Cat",
    description: c.description,
    timeAgo: formatDistanceToNow(new Date(c.created_at), { addSuffix: true }),
  }));
}
