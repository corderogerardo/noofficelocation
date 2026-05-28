import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button, buttonVariants } from "@/components/ui/button";

describe("Button", () => {
  it("renders an accessible button with the brand primary variant", () => {
    render(
      <Button variant="primary" size="pill">
        See our games
      </Button>,
    );
    const button = screen.getByRole("button", { name: "See our games" });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("rounded-pill");
  });

  it("exposes buttonVariants for styling anchors as buttons", () => {
    const className = buttonVariants({ variant: "brandGhost", size: "pill" });
    expect(className).toContain("rounded-pill");
  });
});
