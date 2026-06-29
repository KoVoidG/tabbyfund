/**
 * Authentication types for TabbyFund.
 *
 * Database roles: community, vet, admin (from user_role enum).
 * Functional roles (reporter, volunteer, donor, foster, adopter) are
 * determined by table relationships, not by this type system.
 */

/** The three database-level roles from the user_role PostgreSQL enum. */
export type UserRole = "community" | "vet" | "admin";

/** Application profile — mirrors the profiles table (email lives in auth.users). */
export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

/** Standardized success response from auth server actions. */
export interface AuthSuccess<T = undefined> {
  success: true;
  data?: T;
}

/** Standardized error response from auth server actions. */
export interface AuthError {
  success: false;
  error: {
    code: AuthErrorCode;
    message: string;
  };
}

/** Union type for all auth action results. */
export type AuthActionResult<T = undefined> = AuthSuccess<T> | AuthError;

/** Predictable error codes per Doc 08. */
export type AuthErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "DATABASE_ERROR"
  | "UNKNOWN_ERROR";
