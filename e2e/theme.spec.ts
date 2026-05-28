import { expect, test } from "@playwright/test";

test("theme toggle flips and persists across reload", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");

  await expect(html).toHaveAttribute("data-theme", "dark");

  await page
    .getByRole("button", { name: /toggle light and dark mode/i })
    .click();
  await expect(html).toHaveAttribute("data-theme", "light");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");
});
