import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders the hero, sections, and a mounted canvas", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const text = msg.text();
      // Ignore headless WebGL warnings — the hero degrades gracefully.
      if (
        /webgl|three|context lost|turnstile|challenges\.cloudflare/i.test(text)
      )
        return;
      consoleErrors.push(text);
    });

    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "We build",
    );
    for (const id of [
      "#about",
      "#mission",
      "#services",
      "#showcase",
      "#contact",
    ]) {
      await expect(page.locator(id)).toBeAttached();
    }

    const canvas = page.locator("#hero canvas");
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(0);
    expect(box?.height ?? 0).toBeGreaterThan(0);

    expect(consoleErrors, consoleErrors.join("\n")).toHaveLength(0);
  });

  test("navigates to a section via the primary nav", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Games" })
      .click();
    await expect(page).toHaveURL(/#showcase$/);
  });
});
