import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata = {
  title: "Create Account — TabbyFund",
};

/**
 * Register page — rendered inside the (auth) layout card.
 * Layout provides: centered wrapper, PawPrint logo, branding, white card.
 * This page provides: heading, form, and login link.
 */
export default function RegisterPage() {
  return (
    <div className="space-y-5">
      {/* Heading */}
      <div>
        <h2 className="text-center font-heading text-lg font-semibold text-[#2D3748]">
          Create Account
        </h2>
        <p className="text-center mt-1 text-sm text-[#2D3748]/60">
          Join TabbyFund and help rescue stray cats
        </p>
      </div>

      {/* Form */}
      <RegisterForm />

      {/* Login link */}
      <p className="text-center text-sm text-[#2D3748]/60">
        Already have an account?{" "}
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
