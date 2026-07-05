import { Page, expect } from "@playwright/test";

/**
 * E2E test credentials from environment.
 * Falls back to demo defaults.
 */
export const credentials = {
  community: {
    email: process.env.E2E_COMMUNITY_EMAIL || "somchai@example.com",
    password: process.env.E2E_COMMUNITY_PASSWORD || "password123",
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL || "admin@tabbyfund.com",
    password: process.env.E2E_ADMIN_PASSWORD || "password123",
  },
  vet: {
    email: process.env.E2E_VET_EMAIL || "dr.siriporn@example.com",
    password: process.env.E2E_VET_PASSWORD || "password123",
  },
};

/**
 * Login as a specific role.
 * Uses real #login-email and #login-password selectors from LoginForm.
 * Waits for navigation to complete after server action redirect.
 */
export async function loginAs(
  page: Page,
  role: "community" | "admin" | "vet"
) {
  const creds = credentials[role];

  // Clear ALL storage to ensure fresh session
  await page.context().clearCookies();
  await page.goto("/login");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Wait for the login form to be ready
  await page.waitForSelector("#login-email", { timeout: 15000 });

  await page.fill("#login-email", creds.email);
  await page.fill("#login-password", creds.password);
  await page.click('button[type="submit"]');

  // Wait for the page to leave /login entirely
  // Server action calls redirect() which triggers client navigation
  await page.waitForURL(
    (url) => !url.pathname.startsWith("/login"),
    { timeout: 25000 }
  );

  // Wait for the destination page to fully render
  await page.waitForLoadState("networkidle");
}

/**
 * Assert the page eventually settles on the expected path.
 * Accounts for intermediate redirects.
 */
export async function expectOnPath(page: Page, pathPrefix: string) {
  await expect(page).toHaveURL(new RegExp(`${pathPrefix}`), { timeout: 15000 });
}

/**
 * Clear session and navigate to home.
 */
export async function clearSession(page: Page) {
  await page.context().clearCookies();
  await page.goto("/");
}
