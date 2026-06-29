"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Mail, Lock, CircleAlert } from "lucide-react";
import { loginSchema, type LoginInput } from "../schemas";
import { login } from "../actions";

/**
 * LoginForm — client component for email/password sign-in.
 *
 * - React Hook Form + Zod for client-side validation
 * - useTransition for pending state (does not catch NEXT_REDIRECT)
 * - Server action returns error or redirects on success
 * - Matches design-preview styling exactly
 */
export function LoginForm({ forgotPasswordSlot }: { forgotPasswordSlot?: React.ReactNode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginInput) {
    setServerError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await login(formData);

      // If login succeeds, the server action calls redirect() which
      // throws NEXT_REDIRECT — useTransition handles this correctly
      // and we never reach this point. We only get here on failure.
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

      {/* Email */}
      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-[#2D3748]">
          Email
        </label>
        <div className="relative">
          <Mail size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A788FA]" />
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className={`h-11 w-full rounded-[12px] border bg-white pl-10 pr-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15 ${
              errors.email
                ? "border-red-400 focus:border-red-500"
                : "border-[#A788FA]/20 focus:border-[#6C5CE7]"
            }`}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="login-email-error" className="mt-1 text-xs text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-[#2D3748]">
          Password
        </label>
        <div className="relative">
          <Lock size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A788FA]" />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "login-password-error" : undefined}
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
            {showPassword ? (
              <EyeOff size={16} strokeWidth={1.5} />
            ) : (
              <Eye size={16} strokeWidth={1.5} />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" className="mt-1 text-xs text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Forgot password slot (positioned between password and submit) */}
      {forgotPasswordSlot}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#6C5CE7] text-sm font-semibold text-white transition-all hover:bg-[#A788FA] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <LoaderCircle size={16} strokeWidth={1.5} className="animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
