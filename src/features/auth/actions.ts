"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/auth-helpers";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./schemas";
import type { AuthActionResult, UserProfile } from "./types";

/**
 * Sign in with email and password.
 * On success, redirects to role-based dashboard.
 * On failure, returns a typed error.
 */
export async function login(
  formData: FormData
): Promise<AuthActionResult<undefined>> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // Validate input
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parsed.error.issues[0]?.message ?? "Invalid input",
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      },
    };
  }

  // Fetch profile to determine redirect target
  const profile = await getProfile();
  const destination = getRedirectForRole(profile);

  redirect(destination);
}

/**
 * Register a new user with email and password.
 * Passes display_name via raw_user_meta_data so the handle_new_user
 * trigger creates the profile with the correct name.
 *
 * Email confirmation is disabled for MVP (hackathon speed).
 * User is immediately logged in after registration.
 */
export async function register(
  formData: FormData
): Promise<AuthActionResult<undefined>> {
  const raw = {
    display_name: formData.get("display_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    role: formData.get("role"),
  };

  // Validate input
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parsed.error.issues[0]?.message ?? "Invalid input",
      },
    };
  }

  // Never allow admin self-registration
  const selectedRole = parsed.data.role === "vet" ? "vet" : "community";

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        display_name: parsed.data.display_name,
        role: selectedRole,
      },
    },
  });

  if (error) {
    const message = error.message.toLowerCase().includes("already registered")
      ? "This email is already in use"
      : "Registration failed. Please try again.";

    return {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message,
      },
    };
  }

  // The handle_new_user trigger reads role from raw_user_meta_data
  // and creates the profile with the correct role.
  // Vet accounts start with is_verified = false (admin must approve).
  // New user is auto-logged in (email confirmation disabled for MVP).
  redirect("/dashboard");
}

/**
 * Sign the current user out and redirect to login page.
 */
export async function logout(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Request a password reset email.
 * Always returns success to avoid leaking whether the email exists.
 */
export async function requestPasswordReset(
  formData: FormData
): Promise<AuthActionResult<undefined>> {
  const raw = { email: formData.get("email") };

  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parsed.error.issues[0]?.message ?? "Invalid input",
      },
    };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/reset-password`,
  });

  // Always return success — never reveal if email exists
  return { success: true };
}

/**
 * Update the user's password after a reset.
 * Requires an active session (established via the reset callback).
 */
export async function updatePassword(
  formData: FormData
): Promise<AuthActionResult<undefined>> {
  const raw = {
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parsed.error.issues[0]?.message ?? "Invalid input",
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Unable to update password. The reset link may have expired.",
      },
    };
  }

  redirect("/login");
}

// ============================================================
// Internal helper
// ============================================================

/**
 * Determine the redirect destination based on user role.
 * Used after login to send users to their role-appropriate dashboard.
 */
function getRedirectForRole(profile: UserProfile | null): string {
  if (!profile) return "/dashboard";

  switch (profile.role) {
    case "admin":
      return "/admin";
    case "vet":
      return profile.is_verified ? "/vet" : "/vet/pending";
    case "community":
    default:
      return "/dashboard";
  }
}
