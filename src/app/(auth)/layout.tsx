import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/auth-helpers";

/**
 * Auth layout — wraps login, register, forgot-password, and reset-password pages.
 * Enforces session checks and forwards page-specific custom UI blocks directly.
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

  return <>{children}</>;
}
