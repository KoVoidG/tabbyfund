import { requireAuth, getProfile } from "@/lib/supabase/auth-helpers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { BottomNav } from "@/components/shell/BottomNav";

/**
 * Protected app layout — wraps all authenticated routes.
 *
 * Behavior:
 *   - Calls requireAuth() — redirects to /login if unauthenticated
 *   - Fetches profile for shell components
 *   - If profile is missing (data corruption), redirects to /profile-error
 *   - Renders sidebar (desktop) + topbar + bottom nav (mobile) + children
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const profile = await getProfile();

  if (!profile) {
    redirect("/profile-error");
  }

  return (
    <div className="min-h-dvh bg-[#F7F7FB]">
      {/* Desktop sidebar */}
      <Sidebar profile={profile} />

      {/* Main content area */}
      <div className="md:pl-60">
        {/* Top bar */}
        <Topbar profile={profile} />

        {/* Page content */}
        <main className="px-4 py-6 pb-24 md:px-6 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
