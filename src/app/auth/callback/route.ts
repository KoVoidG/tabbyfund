import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Auth callback route handler.
 *
 * Handles Supabase auth redirects for:
 *   - Password reset (MVP)
 *   - Email verification (future — currently disabled)
 *   - OAuth providers (future — Google, LINE)
 *
 * Flow:
 *   1. Supabase sends the user here with a `code` query param
 *   2. We exchange the code for a session (sets auth cookies)
 *   3. Redirect to the `next` param if provided, otherwise /dashboard
 *   4. On failure, redirect to /login with an error indicator
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Ensure redirect target is a relative path (prevent open redirect)
  const isSafeRelativePath = next.startsWith("/") && !next.startsWith("//");
  const redirectTo = isSafeRelativePath ? next : "/dashboard";

  if (!code) {
    // No code provided — nothing to exchange
    return NextResponse.redirect(
      new URL("/login?error=missing_code", origin)
    );
  }

  // Create a Supabase client that can set cookies on the response
  const response = NextResponse.redirect(new URL(redirectTo, origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // Exchange failed — expired code, already used, or invalid
    return NextResponse.redirect(
      new URL("/login?error=auth_callback_failed", origin)
    );
  }

  return response;
}
