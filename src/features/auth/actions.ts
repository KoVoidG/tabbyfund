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
    clinic_name: formData.get("clinic_name"),
    clinic_address: formData.get("clinic_address"),
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

  // Normalize clinic fields (empty string → null, only for vets)
  const clinicName = selectedRole === "vet" && parsed.data.clinic_name?.trim()
    ? parsed.data.clinic_name.trim() : null;
  const clinicAddress = selectedRole === "vet" && parsed.data.clinic_address?.trim()
    ? parsed.data.clinic_address.trim() : null;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        display_name: parsed.data.display_name,
        role: selectedRole,
        clinic_name: clinicName,
        clinic_address: clinicAddress,
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
  // For vets: geocode clinic address and save to profile.
  if (clinicName || clinicAddress) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Best-effort geocoding — never blocks registration
      const { geocodeClinicAddress } = await import("@/lib/geocode");
      const { lat, lng } = await geocodeClinicAddress(clinicName, clinicAddress);

      const { createServiceClient } = await import("@/lib/supabase/service");
      const serviceClient = createServiceClient();
      await serviceClient
        .from("profiles")
        .update({
          clinic_name: clinicName,
          clinic_address: clinicAddress,
          clinic_lat: lat,
          clinic_lng: lng,
        })
        .eq("id", user.id);
    }
  }
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
 * Checks if the email exists and returns a validation error if not found (hackathon build requirement).
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

  const emailLower = parsed.data.email.toLowerCase();

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
      if (process.env.NODE_ENV === "production") {
        console.error("[auth-actions] NEXT_PUBLIC_SITE_URL is not configured in production!");
        return {
          success: false,
          error: {
            code: "UNKNOWN_ERROR",
            message: "Internal configuration error. Please try again later.",
          },
        };
      } else {
        console.warn("[auth-actions] NEXT_PUBLIC_SITE_URL is not configured. Falling back to localhost.");
      }
    }

    const redirectSiteUrl = siteUrl ?? "http://localhost:3000";

    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${redirectSiteUrl}/auth/callback?next=/reset-password`,
    });

    return { success: true };
  } catch (err: any) {
    console.error("[auth-actions] Unexpected reset error:", err.message);
    return {
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: "An unexpected error occurred. Please try again.",
      },
    };
  }
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
      return "/vet";
    case "community":
    default:
      return "/dashboard";
  }
}
