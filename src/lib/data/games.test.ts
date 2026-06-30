import { describe, expect, it } from "vitest";

import { GAMES } from "@/lib/data/games";

describe("GAMES data", () => {
  it("has at least one title", () => {
    expect(GAMES.length).toBeGreaterThan(0);
  });

  it("has unique ids", () => {
    const ids = GAMES.map((game) => game.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses cover indices within 1..6", () => {
    for (const game of GAMES) {
      expect(game.cover).toBeGreaterThanOrEqual(1);
      expect(game.cover).toBeLessThanOrEqual(6);
    }
  });

  it("declares non-empty tag, title, and meta for each title", () => {
    for (const game of GAMES) {
      expect(game.title).not.toHaveLength(0);
      expect(game.tag).not.toHaveLength(0);
      expect(game.meta.length).toBeGreaterThan(0);
    }
  });
});
