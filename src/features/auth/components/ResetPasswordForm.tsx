"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Lock, CircleAlert, CircleCheck } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordInput } from "../schemas";
import { updatePassword } from "../actions";

/**
 * ResetPasswordForm — client component for setting a new password.
 *
 * Reached only after the Supabase auth callback has established a recovery session.
 * Calls updatePassword server action which redirects to /login on success.
 * If the redirect doesn't fire (e.g. expired token), shows an error.
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

      // On success the action redirects to /login — we only reach here on failure
      if (!result.success) {
        setServerError(result.error.message);
      }
    });
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

      {/* New Password */}
      <div>
        <label htmlFor="reset-password" className="mb-1.5 block text-sm font-medium text-[#2D3748]">
          New Password
        </label>
        <div className="relative">
          <Lock size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A788FA]" />
          <input
            id="reset-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "reset-password-error" : undefined}
            className={`h-11 w-full rounded-[12px] border bg-white pl-10 pr-11 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15 ${
              errors.password
                ? "border-red-400 focus:border-red-500"
                : "border-[#A788FA]/20 focus:border-[#6C5CE7]"
            }`}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D3748]/40 hover:text-[#6C5CE7] transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
          </button>
        </div>
        {errors.password && (
          <p id="reset-password-error" className="mt-1 text-xs text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="reset-confirm" className="mb-1.5 block text-sm font-medium text-[#2D3748]">
          Confirm Password
        </label>
        <div className="relative">
          <Lock size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A788FA]" />
          <input
            id="reset-confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your new password"
            aria-invalid={!!errors.confirm_password}
            aria-describedby={errors.confirm_password ? "reset-confirm-error" : undefined}
            className={`h-11 w-full rounded-[12px] border bg-white pl-10 pr-11 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15 ${
              errors.confirm_password
                ? "border-red-400 focus:border-red-500"
                : "border-[#A788FA]/20 focus:border-[#6C5CE7]"
            }`}
            {...register("confirm_password")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D3748]/40 hover:text-[#6C5CE7] transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
          </button>
        </div>
        {errors.confirm_password && (
          <p id="reset-confirm-error" className="mt-1 text-xs text-red-600" role="alert">
            {errors.confirm_password.message}
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
            Updating...
          </>
        ) : (
          "Update Password"
        )}
      </button>
    </form>
  );
}
