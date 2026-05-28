import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ThemeProvider } from "@/components/providers/theme-provider";

describe("ThemeToggle", () => {
  it("renders an accessible toggle button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(
      screen.getByRole("button", { name: /toggle light and dark mode/i }),
    ).toBeInTheDocument();
  });
});
