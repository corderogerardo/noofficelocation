import { describe, expect, it } from "vitest";

import { contactSchema } from "@/lib/validation/contact";

const valid = {
  name: "Ada",
  email: "ada@studio.com",
  company: "",
  type: "Game development",
  message: "Hello team, let's build a world.",
};

describe("contactSchema", () => {
  it("accepts a valid pitch", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a non-empty name", () => {
    const result = contactSchema.safeParse({ ...valid, name: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Please enter your name.");
    }
  });

  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(
      false,
    );
  });

  it("requires a message", () => {
    expect(contactSchema.safeParse({ ...valid, message: "" }).success).toBe(
      false,
    );
  });

  it("rejects an unknown project type", () => {
    expect(
      contactSchema.safeParse({ ...valid, type: "Spaceship" }).success,
    ).toBe(false);
  });

  it("treats company as optional", () => {
    const withoutCompany = {
      name: valid.name,
      email: valid.email,
      type: valid.type,
      message: valid.message,
    };
    expect(contactSchema.safeParse(withoutCompany).success).toBe(true);
  });
});
