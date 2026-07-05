import { test, expect } from "@playwright/test";

test.describe("Public pages load", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/TabbyFund/i);
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    // The login page has "Sign In" as the form heading
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  });

  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/Create Account/i);
  });
});

test.describe("Unauthenticated redirects", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test("dashboard redirects to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("vet redirects to login", async ({ page }) => {
    await page.goto("/vet");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });
});
