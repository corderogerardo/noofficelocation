import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Eyebrow } from "@/components/ui/eyebrow";

describe("Eyebrow", () => {
  it("renders its label", () => {
    render(<Eyebrow>About the studio</Eyebrow>);
    expect(screen.getByText("About the studio")).toBeInTheDocument();
  });

  it("renders a decorative rule by default", () => {
    const { container } = render(<Eyebrow>Label</Eyebrow>);
    expect(container.querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("omits the rule when withLine is false", () => {
    const { container } = render(<Eyebrow withLine={false}>Label</Eyebrow>);
    expect(container.querySelector("[aria-hidden]")).toBeNull();
  });
});
