"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordInput } from "../schemas";
import { updatePassword } from "../actions";
import { TabbyMascot } from "@/components/branding/TabbyMascot";

/**
 * ResetPasswordForm — client component for setting a new password.
 */
export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  function onSubmit(data: ResetPasswordInput) {
    setServerError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("password", data.password);
      formData.append("confirm_password", data.confirm_password);

      const result = await updatePassword(formData);

      if (!result.success) {
        setServerError(result.error.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Mascot Server error banner */}
      {serverError && (
        <div
          className="flex items-start gap-3 rounded-[16px] border border-[#FF8B7B]/30 bg-[#FFF8F2] p-4 animate-shake"
          role="alert"
        >
          <div className="shrink-0 bg-white p-1 rounded-full shadow-sm border border-[rgba(108,92,231,.08)]">
            <TabbyMascot variant="sad" size="sm" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#25324B]">That reset link didn&apos;t work 😿</h4>
            <p className="text-[11px] text-[#6F7895] font-semibold mt-0.5 leading-normal">
              {serverError}
            </p>
          </div>
        </div>
      )}

      {/* New Password */}
      <div className="space-y-1.5">
        <label htmlFor="reset-password" className="block text-xs font-bold text-[#25324B]/70 uppercase tracking-wide">
          New Password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C5CE7]/60" />
          <input
            id="reset-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "reset-password-error" : undefined}
            className={`h-12 w-full rounded-[16px] border bg-white pl-11 pr-11 text-sm text-[#25324B] placeholder:text-[#6F7895]/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all ${
              errors.password
                ? "border-[#FF8B7B] focus:border-[#FF8B7B]"
                : "border-[rgba(108,92,231,.15)] focus:border-[#6C5CE7]"
            }`}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6F7895]/50 hover:text-[#6C5CE7] transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p id="reset-password-error" className="text-[11px] font-bold text-[#FF8B7B] flex items-center gap-1 pl-1" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="reset-confirm" className="block text-xs font-bold text-[#25324B]/70 uppercase tracking-wide">
          Confirm Password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C5CE7]/60" />
          <input
            id="reset-confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm your new password"
            aria-invalid={!!errors.confirm_password}
            aria-describedby={errors.confirm_password ? "reset-confirm-error" : undefined}
            className={`h-12 w-full rounded-[16px] border bg-white pl-11 pr-11 text-sm text-[#25324B] placeholder:text-[#6F7895]/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all ${
              errors.confirm_password
                ? "border-[#FF8B7B] focus:border-[#FF8B7B]"
                : "border-[rgba(108,92,231,.15)] focus:border-[#6C5CE7]"
            }`}
            {...register("confirm_password")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6F7895]/50 hover:text-[#6C5CE7] transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirm_password && (
          <p id="reset-confirm-error" className="text-[11px] font-bold text-[#FF8B7B] flex items-center gap-1 pl-1" role="alert">
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      {/* Submit button with gentle hover lift */}
      <button
        type="submit"
        disabled={isPending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#6C5CE7] text-sm font-bold text-white shadow-[0_12px_24px_rgba(108,92,231,0.15)] hover:bg-[#5B4BE2] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <LoaderCircle size={16} className="animate-spin" />
            Updating...
          </>
        ) : (
          "Update Password"
        )}
      </button>
    </form>
  );
}
