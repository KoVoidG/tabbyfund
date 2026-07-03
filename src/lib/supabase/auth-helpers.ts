import { redirect } from "next/navigation";
import { createClient } from "./server";
import type { UserProfile, UserRole } from "@/features/auth/types";

/**
 * Auth helper utilities for server-side use only.
 *
 * These run in Server Components, Server Actions, and Route Handlers.
 * Client components should never import this file.
 *
 * Route protection strategy:
 *   - proxy.ts: session refresh only (no redirects)
 *   - (app)/layout.tsx: calls requireAuth()
 *   - Feature layouts (vet, admin): call requireRole()
 *   - Server actions: call requireAuth() or requireRole() at the top
 */

/**
 * Get the currently authenticated Supabase user, or null if not logged in.
 * Does NOT redirect — use requireAuth() for protected routes.
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Get the profile for the currently authenticated user.
 * Returns null if not authenticated or profile doesn't exist.
 */
export async function getProfile(): Promise<UserProfile | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, role, is_verified, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[auth-helpers] Error fetching profile:", error.message);
    return null;
  }

  if (!data) {
    // Self-healing: if user is authenticated but profile is missing (e.g. database reset/push)
    try {
      const { createServiceClient } = await import("./service");
      const serviceClient = createServiceClient();
      const displayName = user.email ? user.email.split("@")[0] : "User";

      const { error: createError } = await serviceClient
        .from("profiles")
        .upsert(
          {
            id: user.id,
            display_name: displayName,
            role: "community",
            is_verified: false,
          },
          {
            onConflict: "id",
            ignoreDuplicates: true,
          }
        );

      if (createError) {
        console.error("[auth-helpers] Failed to self-heal missing profile:", createError.message);
        return null;
      }

      // Query the profile using serviceClient to get the actual record (newly inserted or existing)
      const { data: healedProfile, error: fetchHealedError } = await serviceClient
        .from("profiles")
        .select("id, display_name, avatar_url, role, is_verified, created_at, updated_at")
        .eq("id", user.id)
        .single();

      if (fetchHealedError || !healedProfile) {
        console.error("[auth-helpers] Failed to fetch healed profile:", fetchHealedError?.message);
        return null;
      }

      return healedProfile as UserProfile;
    } catch (err) {
      console.error("[auth-helpers] Self-heal error:", err);
      return null;
    }
  }

  return data as UserProfile;
}

/**
 * Require authentication. Redirects to /login if no valid session.
 * Use at the top of protected server components or server actions.
 *
 * @returns The authenticated Supabase user (never null — redirects instead).
 */
export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Require a specific database role. Redirects if the user doesn't have it.
 *
 * Only checks the three DB roles: community, vet, admin.
 * Functional roles (reporter, volunteer, etc.) are determined by table relationships.
 *
 * Flow:
 *   1. requireAuth() — confirms user is logged in (redirects to /login if not)
 *   2. getProfile() — fetches profile row
 *   3. If profile missing — user is authenticated but has a broken/missing profile → error page
 *   4. Role mismatch — redirect to /dashboard
 *   5. Verification check — redirect to /vet/pending if required
 *
 * @param role - The required role.
 * @param options.requireVerified - If true, also checks is_verified (default: false).
 * @returns The user's profile (never null — redirects instead).
 */
export async function requireRole(
  role: UserRole,
  options: { requireVerified?: boolean } = {}
) {
  // Step 1: Confirm authentication (redirects to /login if no session)
  await requireAuth();

  // Step 2: Fetch profile
  const profile = await getProfile();

  // Step 3: Authenticated but profile is missing (trigger failure or data corruption)
  if (!profile) {
    redirect("/profile-error");
  }

  // Step 4: Role mismatch — send back to community dashboard
  if (profile.role !== role) {
    redirect("/dashboard");
  }

  // Step 5: Verification check (primarily for vets)
  if (options.requireVerified && !profile.is_verified) {
    redirect("/vet");
  }

  return profile;
}
