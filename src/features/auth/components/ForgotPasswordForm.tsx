"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, LoaderCircle, CheckCircle } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../schemas";
import { requestPasswordReset } from "../actions";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const emailValue = watch("email");

  function onSubmit(data: ForgotPasswordInput) {
    setServerError(null);
    setIsSuccess(false);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);

      const result = await requestPasswordReset(formData);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setServerError(result.error.message);
      }
    });
  }

  // If email doesn't exist error state (hackathon build only)
  if (serverError === "No account exists with this email address.") {
    return (
      <div className="space-y-6 text-center py-2">
        <div className="relative mx-auto w-20 h-20 flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-[#FF8B7B]/10 rounded-full scale-125 blur-xl pointer-events-none" />
          <TabbyMascot variant="sad" size="md" className="relative z-10" />
          <div className="w-14 h-1.5 bg-[#25324B]/5 rounded-full blur-[2px] mt-1.5" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-black text-[#25324B]">We couldn&apos;t find that email</h3>
          <p className="text-[11px] text-[#6F7895] font-semibold leading-relaxed">
            There is no account registered with <strong className="text-[#6C5CE7]">{emailValue}</strong>.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/register"
            className="flex h-12 w-full items-center justify-center rounded-full bg-[#6C5CE7] text-sm font-bold text-white shadow-[0_12px_24px_rgba(108,92,231,0.15)] hover:bg-[#5B4BE2] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Create an Account
          </Link>
          <button
            onClick={() => setServerError(null)}
            className="text-xs font-bold text-[#6F7895] hover:text-[#6C5CE7] transition pt-2"
          >
            Try another email
          </button>
        </div>
      </div>
    );
  }

  // Success state matching reference screenshot
  if (isSuccess) {
    return (
      <div className="space-y-6 text-center py-2">
        <div className="space-y-2">
          <h3 className="font-heading text-xl font-black text-[#25324B]">Check your email!</h3>
          
          {/* Custom Green Check Badge */}
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#35C79A]/10 text-[#35C79A]">
            <CheckCircle size={22} className="fill-[#35C79A]/10" />
          </div>

          <p className="text-[11px] text-[#6F7895] font-semibold leading-relaxed px-4">
            If an account exists with that email, we&apos;ve sent a reset link to you.
          </p>
        </div>

        {/* Mascot celebrating holding envelope */}
        <div className="relative pt-4 w-28 h-28 mx-auto flex flex-col items-center animate-bounce" style={{ animationDuration: "3s" }}>
          <TabbyMascot variant="celebrate" size="lg" className="relative z-10" />
          <div className="w-16 h-1.5 bg-[#25324B]/5 rounded-full blur-[1px] mt-1.5" />
        </div>

        <div className="pt-2 border-t border-[rgba(37,50,75,.06)]">
          <Link
            href="/login"
            className="text-xs font-bold text-[#6C5CE7] hover:text-[#5B4BE2] transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Title & Subtitle */}
      <div className="space-y-1 text-center">
        <h2 className="font-heading text-xl font-black text-[#25324B] tracking-tight">
          Forgot Password?
        </h2>
        <p className="text-xs text-[#6F7895] font-semibold">
          No worries! It happens to the best of us.
        </p>
      </div>

      {/* Input Group */}
      <div className="space-y-1.5">
        <div className="space-y-0.5">
          <label htmlFor="forgot-email" className="block text-xs font-bold text-[#25324B]/70 uppercase tracking-wide">
            Enter your email
          </label>
          <span className="block text-[10px] font-semibold text-[#6F7895] leading-normal">
            We&apos;ll send you a link to reset your password.
          </span>
        </div>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C5CE7]/60" />
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "forgot-email-error" : undefined}
            className={`h-12 w-full rounded-[16px] border bg-white pl-11 pr-4 text-sm text-[#25324B] placeholder:text-[#6F7895]/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all ${
              errors.email
                ? "border-[#FF8B7B] focus:border-[#FF8B7B]"
                : "border-[rgba(108,92,231,.15)] focus:border-[#6C5CE7]"
            }`}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="forgot-email-error" className="text-[11px] font-bold text-[#FF8B7B] flex items-center gap-1 pl-1" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isPending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#6C5CE7] text-sm font-bold text-white shadow-[0_12px_24px_rgba(108,92,231,0.15)] hover:bg-[#5B4BE2] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <LoaderCircle size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>
      
    </form>
  );
}
