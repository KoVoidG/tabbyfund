"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Mail, Lock, User, CircleAlert, PawPrint, Stethoscope } from "lucide-react";
import { registerSchema, type RegisterInput } from "../schemas";
import { register as registerAction } from "../actions";

/**
 * RegisterForm — client component for new account creation.
 *
 * - React Hook Form + Zod for client-side validation
 * - useTransition for pending state
 * - Includes role selection (Community / Vet). Admin is never an option.
 * - Matches approved auth design
 */
export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      display_name: "",
      email: "",
      password: "",
      confirm_password: "",
      role: undefined,
    },
  });

  const selectedRole = watch("role");

  function onSubmit(data: RegisterInput) {
    setServerError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("display_name", data.display_name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirm_password", data.confirm_password);
      formData.append("role", data.role);

      const result = await registerAction(formData);

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

      {/* Account Type */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-[#2D3748]">Account Type</legend>
        <div className="grid grid-cols-2 gap-3">
          <label
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-[12px] border-2 p-4 transition-all ${
              selectedRole === "community"
                ? "border-[#6C5CE7] bg-[#6C5CE7]/5"
                : "border-[#A788FA]/20 hover:border-[#A788FA]/40"
            }`}
          >
            <input
              type="radio"
              value="community"
              className="sr-only"
              {...register("role")}
            />
            <PawPrint
              size={24}
              strokeWidth={1.5}
              className={selectedRole === "community" ? "text-[#6C5CE7]" : "text-[#A788FA]"}
            />
            <span className={`text-xs font-medium ${
              selectedRole === "community" ? "text-[#6C5CE7]" : "text-[#2D3748]/70"
            }`}>
              Community
            </span>
          </label>
          <label
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-[12px] border-2 p-4 transition-all ${
              selectedRole === "vet"
                ? "border-[#6C5CE7] bg-[#6C5CE7]/5"
                : "border-[#A788FA]/20 hover:border-[#A788FA]/40"
            }`}
          >
            <input
              type="radio"
              value="vet"
              className="sr-only"
              {...register("role")}
            />
            <Stethoscope
              size={24}
              strokeWidth={1.5}
              className={selectedRole === "vet" ? "text-[#6C5CE7]" : "text-[#A788FA]"}
            />
            <span className={`text-xs font-medium ${
              selectedRole === "vet" ? "text-[#6C5CE7]" : "text-[#2D3748]/70"
            }`}>
              Veterinarian
            </span>
          </label>
        </div>
        {errors.role && (
          <p className="mt-1.5 text-xs text-red-600" role="alert">
            {errors.role.message}
          </p>
        )}
      </fieldset>

      {/* Display Name */}
      <div>
        <label htmlFor="register-name" className="mb-1.5 block text-sm font-medium text-[#2D3748]">
          Display Name
        </label>
        <div className="relative">
          <User size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A788FA]" />
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.display_name}
            aria-describedby={errors.display_name ? "register-name-error" : undefined}
            className={`h-11 w-full rounded-[12px] border bg-white pl-10 pr-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15 ${
              errors.display_name
                ? "border-red-400 focus:border-red-500"
                : "border-[#A788FA]/20 focus:border-[#6C5CE7]"
            }`}
            {...register("display_name")}
          />
        </div>
        {errors.display_name && (
          <p id="register-name-error" className="mt-1 text-xs text-red-600" role="alert">
            {errors.display_name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="register-email" className="mb-1.5 block text-sm font-medium text-[#2D3748]">
          Email
        </label>
        <div className="relative">
          <Mail size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A788FA]" />
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            className={`h-11 w-full rounded-[12px] border bg-white pl-10 pr-4 text-sm text-[#2D3748] placeholder:text-[#2D3748]/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/15 ${
              errors.email
                ? "border-red-400 focus:border-red-500"
                : "border-[#A788FA]/20 focus:border-[#6C5CE7]"
            }`}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="register-email-error" className="mt-1 text-xs text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="register-password" className="mb-1.5 block text-sm font-medium text-[#2D3748]">
          Password
        </label>
        <div className="relative">
          <Lock size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A788FA]" />
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 6 characters"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "register-password-error" : undefined}
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
          <p id="register-password-error" className="mt-1 text-xs text-red-600" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="register-confirm" className="mb-1.5 block text-sm font-medium text-[#2D3748]">
          Confirm Password
        </label>
        <div className="relative">
          <Lock size={16} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A788FA]" />
          <input
            id="register-confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your password"
            aria-invalid={!!errors.confirm_password}
            aria-describedby={errors.confirm_password ? "register-confirm-error" : undefined}
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
          <p id="register-confirm-error" className="mt-1 text-xs text-red-600" role="alert">
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
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
