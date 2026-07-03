import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Sign In — TabbyFund",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <div className="space-y-6">
        {/* Title and Subtitle */}
        <div className="space-y-1">
          <h2 className="font-heading text-2xl font-black text-[#25324B] tracking-tight">
            Sign In
          </h2>
          <p className="text-xs text-[#6F7895] font-semibold leading-normal">
            Glad to see you again!
          </p>
        </div>

        {/* Form */}
        <LoginForm
          forgotPasswordSlot={
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-[#6C5CE7] hover:text-[#5B4BE2] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          }
        />

        {/* Register link */}
        <div className="text-center text-xs text-[#6F7895] font-semibold pt-2">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-[#6C5CE7] hover:text-[#5B4BE2] transition-colors"
          >
            Create one
          </Link>
        </div>

        {/* Secure Banner matching reference */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#6F7895]/60 font-semibold border-t border-[rgba(37,50,75,.06)] pt-4">
          <Shield size={12} className="text-[#6C5CE7]" />
          <span>Secure, transparent, and community-powered. Together for every cat.</span>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
