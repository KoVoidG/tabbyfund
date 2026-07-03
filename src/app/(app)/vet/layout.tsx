import { requireAuth, getProfile } from "@/lib/supabase/auth-helpers";
import { redirect } from "next/navigation";

/**
 * Vet layout — all vets see /vet as their dashboard.
 *
 * Behavior:
 *   - Not authenticated → /login
 *   - Not a vet → /dashboard
 *   - Vet but NOT verified → shows pending screen INLINE (no redirect)
 *   - Verified vet → renders children (real vet tools)
 */
export default async function VetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const profile = await getProfile();

  if (!profile) redirect("/profile-error");
  if (profile.role !== "vet") redirect("/dashboard");

  // Verified or unverified vet: render layout wrapper, children handle specific verification redirection
  return <>{children}</>;
}
