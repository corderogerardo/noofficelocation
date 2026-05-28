"use client";

import { useMutation } from "@tanstack/react-query";

import type { ContactInput } from "@/lib/validation/contact";

interface ContactResponse {
  ok: boolean;
  error?: string;
}

async function submitContact(input: ContactInput): Promise<ContactResponse> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await res.json().catch(() => null)) as ContactResponse | null;

  if (!res.ok || !data?.ok) {
    throw new Error(data?.error ?? "Something went wrong. Please try again.");
  }
  return data;
}

/** TanStack mutation that posts a contact pitch to the route handler. */
export function useContactMutation() {
  return useMutation({ mutationFn: submitContact });
}
