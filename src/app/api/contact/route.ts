import { NextResponse } from "next/server";

import { contactSchema } from "@/lib/validation/contact";

/**
 * Contact endpoint. Validates server-side with the shared zod schema, then
 * would forward to email/CRM. Kept side-effect-free here (front-end success
 * state per the design) — drop your provider call in where noted.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  const result = contactSchema.safeParse(payload);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 422 },
    );
  }

  // Integration point: send the email / persist to your CRM here.
  // Avoid logging PII (the submitter's email); log only non-identifying fields.
  console.info("[contact] pitch received", { type: result.data.type });

  return NextResponse.json({ ok: true });
}
