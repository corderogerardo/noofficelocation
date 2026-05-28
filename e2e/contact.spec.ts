import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  test("shows validation errors on empty submit", async ({ page }) => {
    await page.goto("/#contact");
    await page.getByRole("button", { name: /send pitch/i }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Enter a valid email.")).toBeVisible();
  });

  test("submits a valid pitch and shows success", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      }),
    );

    await page.goto("/#contact");
    await page.getByLabel("Name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@studio.com");
    await page
      .getByLabel(/tell us about it/i)
      .fill("We want to build a cooperative roguelike.");
    await page.getByRole("button", { name: /send pitch/i }).click();

    await expect(page.getByText("Pitch received.")).toBeVisible();
  });
});
