import { requireRole } from "@/lib/supabase/auth-helpers";

/**
 * Vet layout — protects all /vet/* routes.
 *
 * Behavior:
 *   - Calls requireRole('vet', { requireVerified: true })
 *   - If not authenticated → redirects to /login
 *   - If profile missing → redirects to /profile-error
 *   - If role is not 'vet' → redirects to /dashboard
 *   - If vet but not verified → redirects to /vet/pending
 */
export default async function VetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("vet", { requireVerified: true });

  return <>{children}</>;
}
