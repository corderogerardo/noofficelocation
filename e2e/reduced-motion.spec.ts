import { expect, test } from "@playwright/test";

test("reveal content is visible immediately under reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  // Confirm the emulation is actually active.
  const reduced = await page.evaluate(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  expect(reduced, "prefers-reduced-motion should be emulated").toBe(true);

  // A below-the-fold reveal should become fully opaque without scrolling.
  const reveal = page.locator("#showcase .nol-reveal").first();
  await expect(reveal).toHaveCSS("opacity", "1");
});
