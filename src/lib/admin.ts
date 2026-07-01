import { createClient } from "@/lib/supabase/server";

/** Admin dashboard stats from real DB counts */
export interface AdminStats {
  activeCases: number;
  activeFundraisers: number;
  totalDonations: number;
  catsRehomed: number;
  communityUsers: number;
  verifiedVets: number;
  pendingVets: number;
}

/** A vet profile for the admin verification page */
export interface VetProfile {
  id: string;
  display_name: string;
  is_verified: boolean;
  created_at: string;
  clinic_name: string | null;
  clinic_address: string | null;
  clinic_lat: number | null;
  clinic_lng: number | null;
}

/**
 * Get real admin dashboard stats.
 */
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  // Active cases (not terminal)
  const { count: activeCases } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .not("status", "in", '("ADOPTED","SHELTERED","REUNITED","CANCELLED","LOST_CONTACT","DECEASED")');

  // Active fundraisers
  const { count: activeFundraisers } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .eq("status", "FUNDING_OPEN");

  // Total donations
  const { data: donationSum } = await supabase
    .from("donations")
    .select("amount")
    .in("status", ["HELD_IN_ESCROW", "RELEASED"]);

  const totalDonations = donationSum?.reduce((sum, d) => sum + d.amount, 0) ?? 0;

  // Cats rehomed (adopted)
  const { count: catsRehomed } = await supabase
    .from("cases")
    .select("id", { count: "exact", head: true })
    .eq("status", "ADOPTED");

  // Community users
  const { count: communityUsers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "community");

  // Verified vets
  const { count: verifiedVets } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "vet")
    .eq("is_verified", true);

  // Pending vets
  const { count: pendingVets } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "vet")
    .eq("is_verified", false);

  return {
    activeCases: activeCases ?? 0,
    activeFundraisers: activeFundraisers ?? 0,
    totalDonations,
    catsRehomed: catsRehomed ?? 0,
    communityUsers: communityUsers ?? 0,
    verifiedVets: verifiedVets ?? 0,
    pendingVets: pendingVets ?? 0,
  };
}

/**
 * Get pending vet profiles (role=vet, not verified).
 */
export async function getPendingVets(): Promise<VetProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, is_verified, created_at, clinic_name, clinic_address, clinic_lat, clinic_lng")
    .eq("role", "vet")
    .eq("is_verified", false)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

/**
 * Get verified vet profiles.
 */
export async function getVerifiedVets(): Promise<VetProfile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, is_verified, created_at, clinic_name, clinic_address, clinic_lat, clinic_lng")
    .eq("role", "vet")
    .eq("is_verified", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}
