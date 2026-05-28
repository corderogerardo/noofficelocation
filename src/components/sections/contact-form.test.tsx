import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "@/components/sections/contact-form";
import { renderWithProviders } from "@/test/utils";

function mockFetchOk() {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({ ok: true }),
  } as unknown as Response);
}

describe("ContactForm", () => {
  beforeEach(() => {
    mockFetchOk();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows validation errors and does not submit when empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send pitch/i }));

    expect(
      await screen.findByText("Please enter your name."),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email.")).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("submits a valid pitch and shows the success state", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email"), "ada@studio.com");
    await user.type(
      screen.getByLabelText(/tell us about it/i),
      "We want to build a cooperative roguelike.",
    );
    await user.click(screen.getByRole("button", { name: /send pitch/i }));

    expect(await screen.findByText("Pitch received.")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
