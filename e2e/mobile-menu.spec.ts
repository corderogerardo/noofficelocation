import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test.describe("mobile menu", () => {
  test("opens and closes when a link is tapped", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();

    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();

    await menu.getByRole("link", { name: "About" }).click();
    await expect(menu).toBeHidden();
  });

  test("closes when the X toggle is tapped", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();

    // The toggle must stay above the overlay so it can be tapped to close.
    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(page.locator("#mobile-menu")).toBeHidden();
  });

  test("closes on Escape", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toBeHidden();
  });
});
