"use client";

import dynamic from "next/dynamic";

/**
 * Lazily loads the contact form (react-hook-form + zod + Base UI Select +
 * TanStack mutation) so that heavy form code stays off the initial bundle —
 * the form is the last section on the page.
 */
const ContactForm = dynamic(
  () => import("@/components/sections/contact-form").then((m) => m.ContactForm),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="bg-surface-3/40 min-h-[440px] animate-pulse rounded-[16px]"
      />
    ),
  },
);

export function ContactFormLazy() {
  return <ContactForm />;
}
