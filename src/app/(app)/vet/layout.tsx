import { requireAuth, getProfile } from "@/lib/supabase/auth-helpers";
import { redirect } from "next/navigation";
import { Clock, ShieldCheck } from "lucide-react";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

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

  // Unverified vet: show pending screen inline at /vet
  if (!profile.is_verified) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-12 text-center">
        <TabbyMascot variant="think" size="lg" className="mx-auto" />
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#2D3748]">
            Verification Pending
          </h1>
          <p className="mt-2 text-sm text-[#2D3748]/60">
            Your vet verification is pending. Admin approval is required before you can access vet tools.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs font-medium text-amber-700">
          <Clock size={14} strokeWidth={1.5} />
          Awaiting Admin Verification
        </div>
        <div className="rounded-[12px] bg-[#6C5CE7]/5 p-4">
          <p className="flex items-start gap-2 text-[11px] text-[#6C5CE7] text-left">
            <ShieldCheck size={14} strokeWidth={1.5} className="mt-0.5 shrink-0" />
            Once an admin approves your account, you will have access to the vet dashboard, case management, and treatment tools.
          </p>
        </div>
      </div>
    );
  }

  // Verified vet: render actual vet tools
  return <>{children}</>;
}
