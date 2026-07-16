import { test, expect } from "@playwright/test";

// This test is a regression test for a bug where the back button after
// logging in would return to the login form.
test.describe("post-login browser history", () => {
  test("back button after login does not return to the login form", async ({ page }) => {
    await page.route("**/api/v1/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            user: {
              id: "u1",
              email: "test@example.com",
              firstName: "Test",
              lastName: "User",
              role: "Customer",
              isVerified: true,
            },
            accessToken: "fake-access-token",
            refreshToken: "fake-refresh-token",
          },
        }),
      });
    });

    await page.goto("/login");
    await page.getByLabel(/^email$/i).fill("test@example.com");
    await page.getByLabel(/^password$/i).fill("Password123!");
    await page.getByRole("button", { name: /log in/i }).click();

    await page.waitForURL("**/home");

    await page.goBack();

    // A stale /login landing after Back is the bug this test guards
    // against — the user should still be on /home.
    await expect(page).toHaveURL(/\/home/);
  });
});