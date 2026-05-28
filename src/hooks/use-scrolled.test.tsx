import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { useScrolled } from "@/hooks/use-scrolled";

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    value,
    writable: true,
    configurable: true,
  });
}

describe("useScrolled", () => {
  afterEach(() => setScrollY(0));

  it("is false at the top of the page", () => {
    setScrollY(0);
    const { result } = renderHook(() => useScrolled(24));
    expect(result.current).toBe(false);
  });

  it("becomes true after scrolling past the threshold", () => {
    setScrollY(0);
    const { result } = renderHook(() => useScrolled(24));
    act(() => {
      setScrollY(120);
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);
  });
});
