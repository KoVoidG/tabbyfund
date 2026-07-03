"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Mail, Lock, User, Check, ArrowLeft, ArrowRight } from "lucide-react";
import { registerSchema, type RegisterInput } from "../schemas";
import { register as registerAction } from "../actions";
import { TabbyMascot } from "@/components/branding/TabbyMascot";
import Link from "next/link";

export function RegisterForm() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      display_name: "",
      email: "",
      password: "",
      confirm_password: "",
      role: undefined,
      clinic_name: "",
      clinic_address: "",
    },
  });

  const selectedRole = watch("role");

  async function handleRoleSelect(role: "community" | "vet") {
    setValue("role", role);
    const isValid = await trigger("role");
    if (isValid) {
      setStep(2);
    }
  }

  async function handleNextStep() {
    // Validate Step 2 fields
    const isValid = await trigger(["display_name", "email", "password", "confirm_password"]);
    if (isValid) {
      if (selectedRole === "vet") {
        setStep(3); // Vets go to Clinic Info step
      } else {
        // Community Members submit immediately from Step 2
        onSubmit(getValues());
      }
    }
  }

  function onSubmit(data: RegisterInput) {
    setServerError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("display_name", data.display_name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirm_password", data.confirm_password);
      formData.append("role", data.role);
      if (data.clinic_name) formData.append("clinic_name", data.clinic_name);
      if (data.clinic_address) formData.append("clinic_address", data.clinic_address);

      const result = await registerAction(formData);

      if (!result.success) {
        setServerError(result.error.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Dynamic Step Progress Indicators based on role selection */}
      <div className="flex items-center justify-center gap-2 max-w-xl mx-auto mb-8 text-[10px] font-bold text-[#6F7895] select-none">
        {/* Step 1: Account Type */}
        <div className="flex items-center gap-1.5">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
            step > 1 ? "bg-[#6C5CE7] text-white" : "bg-[#6C5CE7] text-white shadow-sm"
          }`}>
            {step > 1 ? "✓" : "1"}
          </div>
          <span className={step >= 1 ? "text-[#25324B]" : ""}>Account Type</span>
        </div>
        <div className="w-8 h-px bg-[rgba(37,50,75,.08)]" />

        {/* Step 2: Account Info */}
        <div className="flex items-center gap-1.5">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
            step > 2 ? "bg-[#6C5CE7] text-white" : step === 2 ? "bg-[#6C5CE7]/10 text-[#6C5CE7] border border-[#6C5CE7]/25" : "bg-slate-100 text-slate-400"
          }`}>
            {step > 2 ? "✓" : "2"}
          </div>
          <span className={step >= 2 ? "text-[#25324B]" : ""}>Account Info</span>
        </div>
        
        {/* Render Clinic Info step only if Veterinarian is selected */}
        {selectedRole === "vet" && (
          <>
            <div className="w-8 h-px bg-[rgba(37,50,75,.08)]" />
            <div className="flex items-center gap-1.5">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                step > 3 ? "bg-[#6C5CE7] text-white" : step === 3 ? "bg-[#6C5CE7]/10 text-[#6C5CE7] border border-[#6C5CE7]/25" : "bg-slate-100 text-slate-400"
              }`}>
                {step > 3 ? "✓" : "3"}
              </div>
              <span className={step >= 3 ? "text-[#25324B]" : ""}>Clinic Info</span>
            </div>
          </>
        )}

        <div className="w-8 h-px bg-[rgba(37,50,75,.08)]" />

        {/* Final Step: Review */}
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-400">
            {selectedRole === "vet" ? "4" : "3"}
          </div>
          <span>Review</span>
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <div
          className="flex items-start gap-3 rounded-[16px] border border-red-200 bg-red-50 p-4"
          role="alert"
        >
          <div className="shrink-0 bg-red-100 p-1.5 rounded-full">
            <TabbyMascot variant="sad" size="sm" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-red-800">Something went wrong 😿</h4>
            <p className="text-[11px] text-red-700 mt-0.5 leading-normal">{serverError}</p>
          </div>
        </div>
      )}

      {/* Step 1: Account Type */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="font-heading text-xl font-black text-[#25324B] tracking-tight">Create Your Account</h2>
            <p className="text-xs text-[#6F7895] font-semibold">Join our rescue community and start making a difference.</p>
          </div>

          <fieldset className="space-y-4">
            <legend className="block text-xs font-bold text-[#6F7895] uppercase tracking-wide mb-1">I want to join as</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Community Member card */}
              <div
                onClick={() => handleRoleSelect("community")}
                className={`flex cursor-pointer flex-col items-center text-center gap-4 rounded-[24px] border-2 p-6 transition-all hover:scale-[1.01] active:scale-[0.99] ${
                  selectedRole === "community"
                    ? "border-[#6C5CE7] bg-[#6C5CE7]/5"
                    : "border-[rgba(108,92,231,.12)] bg-white hover:border-[#6C5CE7]/30"
                }`}
              >
                <div className="relative w-36 h-36 flex flex-col items-center justify-center">
                  <TabbyMascot variant="wave" size="xl" className="relative z-10" />
                  <div className="w-20 h-1.5 bg-[#25324B]/5 rounded-full blur-[1.5px] absolute bottom-1.5 left-8" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-[#25324B]">Community Member</h3>
                  <p className="text-[10px] text-[#6F7895] font-semibold leading-relaxed">
                    Report cases, donate, foster, or adopt cats in need.
                  </p>
                  {/* Checklist */}
                  <div className="space-y-1.5 text-left pl-3 text-[10px] font-bold text-[#6F7895]">
                    <div className="flex items-center gap-2">
                      <Check size={12} className="text-[#6C5CE7]" />
                      <span>Report emergencies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={12} className="text-[#6C5CE7]" />
                      <span>Fund treatments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={12} className="text-[#6C5CE7]" />
                      <span>Foster & adopt cats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={12} className="text-[#6C5CE7]" />
                      <span>Join our community</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Veterinarian card - uses the new tabby-doc mascot */}
              <div
                onClick={() => handleRoleSelect("vet")}
                className={`flex cursor-pointer flex-col items-center text-center gap-4 rounded-[24px] border-2 p-6 transition-all hover:scale-[1.01] active:scale-[0.99] ${
                  selectedRole === "vet"
                    ? "border-[#6C5CE7] bg-[#6C5CE7]/5"
                    : "border-[rgba(108,92,231,.12)] bg-white hover:border-[#6C5CE7]/30"
                }`}
              >
                <div className="relative w-36 h-36 flex flex-col items-center justify-center">
                  <TabbyMascot variant="doc" size="xl" className="relative z-10" />
                  <div className="w-20 h-1.5 bg-[#25324B]/5 rounded-full blur-[1.5px] absolute bottom-1.5 left-8" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-extrabold text-[#25324B]">Veterinarian</h3>
                  <p className="text-[10px] text-[#6F7895] font-semibold leading-relaxed">
                    Submit treatment quotes and administer care.
                  </p>
                  {/* Checklist */}
                  <div className="space-y-1.5 text-left pl-3 text-[10px] font-bold text-[#6F7895]">
                    <div className="flex items-center gap-2">
                      <Check size={12} className="text-[#6C5CE7]" />
                      <span>Provide treatment quotes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={12} className="text-[#6C5CE7]" />
                      <span>Manage cases</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={12} className="text-[#6C5CE7]" />
                      <span>Track recoveries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={12} className="text-[#6C5CE7]" />
                      <span>Help save more lives</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Sign in redirect */}
          <div className="text-center text-xs text-[#6F7895] font-semibold pt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#6C5CE7] hover:text-[#5B4BE2] transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}

      {/* Step 2: Information form (credentials fields) */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[rgba(37,50,75,.06)] pb-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6F7895] hover:text-[#6C5CE7] transition"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h3 className="font-heading text-base font-black text-[#25324B]">
              Account Details
            </h3>
            <div className="w-14" /> {/* Spacer */}
          </div>

          <div className="max-w-md mx-auto space-y-4">
            {/* Display Name */}
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="block text-xs font-bold text-[#25324B]/70 uppercase tracking-wide">
                Display Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C5CE7]/60" />
                <input
                  id="register-name"
                  type="text"
                  placeholder="Your name"
                  aria-invalid={!!errors.display_name}
                  aria-describedby={errors.display_name ? "register-name-error" : undefined}
                  className={`h-12 w-full rounded-[16px] border bg-white pl-11 pr-4 text-sm text-[#25324B] placeholder:text-[#6F7895]/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all ${
                    errors.display_name ? "border-[#FF8B7B] focus:border-[#FF8B7B]" : "border-[rgba(108,92,231,.15)] focus:border-[#6C5CE7]"
                  }`}
                  {...register("display_name")}
                />
              </div>
              {errors.display_name && (
                <p id="register-name-error" className="text-[11px] font-bold text-[#FF8B7B]" role="alert">
                  {errors.display_name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="register-email" className="block text-xs font-bold text-[#25324B]/70 uppercase tracking-wide">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C5CE7]/60" />
                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "register-email-error" : undefined}
                  className={`h-12 w-full rounded-[16px] border bg-white pl-11 pr-4 text-sm text-[#25324B] placeholder:text-[#6F7895]/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all ${
                    errors.email ? "border-[#FF8B7B] focus:border-[#FF8B7B]" : "border-[rgba(108,92,231,.15)] focus:border-[#6C5CE7]"
                  }`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p id="register-email-error" className="text-[11px] font-bold text-[#FF8B7B]" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="register-password" className="block text-xs font-bold text-[#25324B]/70 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C5CE7]/60" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "register-password-error" : undefined}
                  className={`h-12 w-full rounded-[16px] border bg-white pl-11 pr-11 text-sm text-[#25324B] placeholder:text-[#6F7895]/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all ${
                    errors.password ? "border-[#FF8B7B] focus:border-[#FF8B7B]" : "border-[rgba(108,92,231,.15)] focus:border-[#6C5CE7]"
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
                <p id="register-password-error" className="text-[11px] font-bold text-[#FF8B7B]" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="register-confirm" className="block text-xs font-bold text-[#25324B]/70 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C5CE7]/60" />
                <input
                  id="register-confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  aria-invalid={!!errors.confirm_password}
                  aria-describedby={errors.confirm_password ? "register-confirm-error" : undefined}
                  className={`h-12 w-full rounded-[16px] border bg-white pl-11 pr-11 text-sm text-[#25324B] placeholder:text-[#6F7895]/40 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all ${
                    errors.confirm_password ? "border-[#FF8B7B] focus:border-[#FF8B7B]" : "border-[rgba(108,92,231,.15)] focus:border-[#6C5CE7]"
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
                <p id="register-confirm-error" className="text-[11px] font-bold text-[#FF8B7B]" role="alert">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* Continue/Submit button */}
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isPending}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#6C5CE7] text-sm font-bold text-white shadow-[0_12px_24px_rgba(108,92,231,0.15)] hover:bg-[#5B4BE2] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Creating Account...
                </>
              ) : selectedRole === "vet" ? (
                <>
                  Continue <ArrowRight size={14} />
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Vet Clinic Information (Only reached by Vets) */}
      {step === 3 && selectedRole === "vet" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[rgba(37,50,75,.06)] pb-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6F7895] hover:text-[#6C5CE7] transition"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <h3 className="font-heading text-base font-black text-[#25324B]">
              Veterinarian Clinic Info
            </h3>
            <div className="w-14" /> {/* Spacer */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form Fields */}
            <div className="lg:col-span-3 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="register-clinic-name" className="block text-xs font-bold text-[#25324B]/70 uppercase tracking-wide">
                  Clinic Name
                </label>
                <input
                  id="register-clinic-name"
                  type="text"
                  placeholder="e.g. Bangkok Pet Clinic"
                  className="h-12 w-full rounded-[16px] border border-[rgba(108,92,231,.15)] bg-white px-4 text-sm text-[#25324B] placeholder:text-[#6F7895]/40 focus:border-[#6C5CE7] focus:outline-none"
                  {...register("clinic_name")}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="register-clinic-address" className="block text-xs font-bold text-[#25324B]/70 uppercase tracking-wide">
                  Clinic Address
                </label>
                <input
                  id="register-clinic-address"
                  type="text"
                  placeholder="e.g. 45 Sukhumvit Soi 39, Bangkok"
                  className="h-12 w-full rounded-[16px] border border-[rgba(108,92,231,.15)] bg-white px-4 text-sm text-[#25324B] placeholder:text-[#6F7895]/40 focus:border-[#6C5CE7] focus:outline-none"
                  {...register("clinic_address")}
                />
              </div>
              <p className="text-[10px] text-[#6F7895] leading-normal font-semibold">
                Clinic coordinates are resolved to assist dispatch transport routing.
              </p>
            </div>

            {/* Verification Notice matching the reference layout */}
            <div className="lg:col-span-2 bg-[#FFF8F2] border border-[rgba(108,92,231,.08)] rounded-[24px] p-5 flex flex-col justify-between items-center text-center min-h-[250px]">
              <div className="space-y-2">
                <h4 className="text-sm font-black text-[#25324B]">Verification Notice</h4>
                <p className="text-[11px] text-[#6F7895] font-semibold leading-relaxed">
                  Our team will review your clinic information and credentials. You&apos;ll be able to submit treatment quotes and manage cases once verified.
                </p>
              </div>
              
              {/* Vet Mascot doctor variant */}
              <div className="relative pt-4 w-36 h-36 flex flex-col items-center justify-center">
                <TabbyMascot variant="doc" size="xl" className="relative z-10" />
                <div className="w-20 h-1.5 bg-[#25324B]/5 rounded-full blur-[1px] mt-1.5" />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="max-w-md mx-auto pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#6C5CE7] text-sm font-bold text-white shadow-[0_12px_24px_rgba(108,92,231,0.15)] hover:bg-[#5B4BE2] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
