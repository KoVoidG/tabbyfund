import { requireRole } from "@/lib/supabase/auth-helpers";

/**
 * Admin layout — protects all /admin/* routes.
 *
 * Behavior:
 *   - Calls requireRole('admin')
 *   - If not authenticated → redirects to /login
 *   - If profile missing → redirects to /profile-error
 *   - If role is not 'admin' → redirects to /dashboard
 *
 * Per Doc 03: Only three roles exist (community, vet, admin).
 * Admin accounts are never self-registerable.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");

  return <>{children}</>;
}
