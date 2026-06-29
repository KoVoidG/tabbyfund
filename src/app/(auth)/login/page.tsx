import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Sign In — TabbyFund",
};

/**
 * Login page — rendered inside the (auth) layout card.
 * Layout provides: centered wrapper, PawPrint logo, branding, white card.
 * This page provides: heading, form, forgot-password link, and register link.
 */
export default function LoginPage() {
  return (
    <div className="space-y-5">
      {/* Heading */}
      <div>
        <h2 className="text-center font-heading text-lg font-semibold text-[#2D3748]">
          Sign In
        </h2>
        <p className="text-center mt-1 text-sm text-[#2D3748]/60">
          Welcome back to TabbyFund
        </p>
      </div>

      {/* Form + forgot password link positioned between password and submit */}
      <LoginForm
        forgotPasswordSlot={
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-xs text-[#6C5CE7] hover:text-[#A788FA] transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        }
      />

      {/* Register link */}
      <p className="text-center text-sm text-[#2D3748]/60">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-[#6C5CE7] hover:text-[#A788FA] transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
