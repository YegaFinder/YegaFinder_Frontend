import { test, expect } from "@playwright/test";

test.describe("merchant profile — happy path", () => {
  test("edit business details, upload a logo, and see it persist after reload", async ({ page }) => {
    let profile: Record<string, unknown> = {
      id: "mp-1",
      businessName: "Old Business Name",
      description: "",
      logoUrl: "",
      bannerUrl: "",
      contactEmail: "",
      contactPhone: "",
      businessAddress: "",
      websiteUrl: "",
      businessCategories: [],
      socialMedia: {},
      servicesOffered: [],
      businessHours: [],
      verificationStatus: "pending",
      averageRating: 0,
      totalReviews: 0,
      isFeatured: false,
      isProfileComplete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: "u1",
        email: "merchant@example.com",
        firstName: "Merchant",
        lastName: "User",
        role: "Merchant",
        isVerified: true,
        isEmailVerified: true,
        isPhoneVerified: false,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    };

    await page.route("**/api/v1/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "ok",
          timestamp: new Date().toISOString(),
          data: {
            user: profile.user,
            accessToken: "fake-access-token",
            refreshToken: "fake-refresh-token",
            role: "Merchant",
          },
        }),
      });
    });

    await page.route("**/api/v1/profiles/merchant", async (route) => {
      const method = route.request().method();
      if (method === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, message: "ok", timestamp: new Date().toISOString(), data: profile }),
        });
        return;
      }
      if (method === "PUT") {
        const body = route.request().postDataJSON();
        profile = { ...profile, ...body };
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            message: "Profile updated",
            timestamp: new Date().toISOString(),
            data: profile,
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.route("**/api/v1/uploads/presign", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "ok",
          timestamp: new Date().toISOString(),
          data: {
            uploadUrl: "https://fake-s3.example.com/upload-target",
            fileUrl: "https://fake-s3.example.com/logos/new-logo.png",
            key: "logos/new-logo.png",
          },
        }),
      });
    });

    await page.route("https://fake-s3.example.com/upload-target", async (route) => {
      await route.fulfill({ status: 200, body: "" });
    });

    await page.goto("/login");
    await page.getByLabel(/^email$/i).fill("merchant@example.com");
    await page.getByLabel(/^password$/i).fill("Password123!");
    await page.getByRole("button", { name: /log in/i }).click();

    await page.waitForURL("**/dashboard/profile");

    const nameInput = page.getByLabel(/business name/i);
    await expect(nameInput).toHaveValue("Old Business Name");
    await nameInput.fill("New Business Name");

    await page.getByLabel(/business logo/i).setInputFiles({
      name: "logo.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        "base64",
      ),
    });

    await expect(page.getByText(/image uploaded successfully/i)).toBeVisible();

    await page.getByRole("button", { name: /save business details/i }).click();
    await expect(page.getByText(/business details saved/i)).toBeVisible();

    await page.reload();

    await expect(page.getByLabel(/business name/i)).toHaveValue("New Business Name");
    await expect(page.getByRole("img", { name: /business logo preview/i })).toHaveAttribute(
      "src",
      "https://fake-s3.example.com/logos/new-logo.png",
    );
  });
});