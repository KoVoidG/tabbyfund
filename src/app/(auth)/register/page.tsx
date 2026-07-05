import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { PawPrint } from "lucide-react";

export const metadata = {
  title: "Create Account — TabbyFund",
};

export default function RegisterPage() {
  return (
    <div className="min-h-dvh bg-[#F7F7FB] py-12 px-4 flex flex-col items-center justify-center text-[#25324B] selection:bg-[#EEE9FF] selection:text-[#6C5CE7]">
      <div className="w-full max-w-4xl space-y-6">
        {/* Logo Header */}
        <div className="flex items-center gap-2 justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7]">
            <PawPrint size={18} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight">TabbyFund</span>
        </div>

        {/* Wizard Form Wrapper */}
        <div className="rounded-[24px] bg-white border border-[rgba(108,92,231,.08)] p-6 sm:p-8 shadow-[0_20px_50px_rgba(108,92,231,0.03)] w-full">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
