import { redirect } from "next/navigation";
import { PawPrint } from "lucide-react";
import { getUser } from "@/lib/supabase/auth-helpers";

/**
 * Auth layout — wraps login, register, forgot-password, and reset-password pages.
 *
 * Behavior:
 *   - If user is already authenticated → redirect to /dashboard
 *   - Otherwise → render a centered card layout with TabbyFund branding
 *
 * Design:
 *   - Mobile-first centered card
 *   - Soft cream background (brand color)
 *   - Generous padding
 *   - TabbyFund logo/title at top
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirect authenticated users away from auth pages
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#F7F7FB] px-4 pb-12 pt-8">
      <div className="w-full max-w-[460px] space-y-4">
        {/* Branding */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#6C5CE7]/10">
            <PawPrint size={28} strokeWidth={1.5} className="text-[#6C5CE7]" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#6C5CE7]">
            TabbyFund
          </h1>
          <p className="mt-1 text-sm text-[#2D3748]/60">
            Community-powered cat rescue
          </p>
        </div>

        {/* Auth card */}
        <div className="rounded-[20px] bg-white p-5 shadow-sm sm:p-7">
          {children}
        </div>
      </div>
    </div>
  );
}
