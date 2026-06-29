import Link from "next/link";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export const metadata = {
  title: "New Password — TabbyFund",
};

/**
 * Reset password page — rendered inside the (auth) layout card.
 * Layout provides: centered wrapper, PawPrint logo, branding, white card.
 * This page provides: heading, form, and login link.
 *
 * Reached via /auth/callback after a valid recovery link is clicked.
 * The callback establishes the recovery session before redirecting here.
 */
export default function ResetPasswordPage() {
  return (
    <div className="space-y-5">
      {/* Heading */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-[#2D3748]">
          Choose a New Password
        </h2>
        <p className="mt-1 text-sm text-[#2D3748]/60">
          Enter your new password below to regain access to your account.
        </p>
      </div>

      {/* Form */}
      <ResetPasswordForm />

      {/* Back to login */}
      <p className="text-center text-sm text-[#2D3748]/60">
        Back to{" "}
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
