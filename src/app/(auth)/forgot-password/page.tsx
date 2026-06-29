import Link from "next/link";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password — TabbyFund",
};

/**
 * Forgot password page — rendered inside the (auth) layout card.
 * Layout provides: centered wrapper, PawPrint logo, branding, white card.
 * This page provides: heading, description, form, and login link.
 */
export default function ForgotPasswordPage() {
  return (
    <div className="space-y-5">
      {/* Heading */}
      <div>
        <h2 className="text-center font-heading text-lg font-semibold text-[#2D3748]">
          Reset Password
        </h2>
        <p className="text-center mt-1 text-sm text-[#2D3748]/60">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <ForgotPasswordForm />

      {/* Back to login */}
      <p className="text-center text-sm text-[#2D3748]/60">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-[#6C5CE7] hover:text-[#A788FA] transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
