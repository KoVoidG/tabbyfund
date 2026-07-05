import { test, expect } from "@playwright/test";
import { loginAs, expectOnPath, credentials } from "./helpers";

/**
 * Auth E2E tests.
 *
 * PREREQUISITES:
 * These tests require demo users in Supabase Auth with correct profiles:
 *   - somchai@example.com → role=community
 *   - admin@tabbyfund.com → role=admin, is_verified=true
 *   - dr.siriporn@example.com → role=vet, is_verified=true
 */

test.describe("Community user", () => {
  test("can log in and reach dashboard", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAs(page, "community");
    await expectOnPath(page, "/dashboard");
    await expect(page.locator("text=Welcome back")).toBeVisible({ timeout: 10000 });
    await context.close();
  });

  test("cannot access /admin — blocked from admin content", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAs(page, "community");
    await expectOnPath(page, "/dashboard");
    // Navigate to /admin and wait for whatever happens
    await Promise.race([
      page.goto("/admin").catch(() => {}),
      page.waitForTimeout(10000),
    ]);
    // The key assertion: community user should NOT see admin content
    const hasAdminContent = await page.locator("text=Admin Operations Center").isVisible().catch(() => false);
    expect(hasAdminContent).toBeFalsy();
    await context.close();
  });

  test("cannot access /vet — blocked from vet content", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAs(page, "community");
    await expectOnPath(page, "/dashboard");
    await Promise.race([
      page.goto("/vet").catch(() => {}),
      page.waitForTimeout(10000),
    ]);
    // Community user should NOT see verified vet content
    const hasVetContent = await page.locator("text=Verified Vet").isVisible().catch(() => false);
    expect(hasVetContent).toBeFalsy();
    await context.close();
  });
});

test.describe("Admin user", () => {
  test("can log in and reach admin page", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAs(page, "admin");
    await expectOnPath(page, "/admin");
    // Wait for page content to render — admin page shows "Admin Operations Center"
    await expect(page.getByText("Admin Operations Center")).toBeVisible({ timeout: 15000 });
    await context.close();
  });
});

test.describe("Verified vet", () => {
  test("can log in and reach vet page", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAs(page, "vet");
    await expectOnPath(page, "/vet");
    // Real vet page shows "Verified Vet" badge for verified vets
    await expect(page.locator("text=Verified Vet")).toBeVisible({ timeout: 10000 });
    await context.close();
  });
});
