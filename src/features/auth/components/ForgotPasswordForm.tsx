"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, LoaderCircle, CircleAlert, CircleCheck } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../schemas";
import { requestPasswordReset } from "../actions";

/**
 * ForgotPasswordForm — client component for requesting a password reset email.
 *
 * - React Hook Form + Zod for client-side validation
 * - useTransition for pending state
 * - Shows success message after submission (never reveals if email exists)
 * - Matches approved auth design
 */
export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

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

  // Success state
  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <CircleCheck size={24} strokeWidth={1.5} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#2D3748]">Check your email</p>
          <p className="mt-1 text-xs text-[#2D3748]/60">
            If an account exists with that email, we&apos;ve sent a password reset link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Server error */}
      {serverError && (
        <div
          className="flex items-start gap-2 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3"
          role="alert"
        >
          <CircleAlert size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-medium text-[#2D3748]">
          Email
        </label>
        <div className="relative">
          <Mail size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A788FA]" />
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "forgot-email-error" : undefined}
            className={`h-11 w-full rounded-[12px] border bg-white pl-10 pr-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15 ${
              errors.email
                ? "border-red-400 focus:border-red-500"
                : "border-[#A788FA]/20 focus:border-[#6C5CE7]"
            }`}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="forgot-email-error" className="mt-1 text-xs text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition-all hover:bg-[#A788FA] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <LoaderCircle size={16} strokeWidth={1.5} className="animate-spin" />
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>
    </form>
  );
}
