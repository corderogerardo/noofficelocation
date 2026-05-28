import { z } from "zod";

import { PROJECT_TYPES } from "@/lib/data/studio";

/** Matches the prototype's lightweight email check. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  email: z
    .string()
    .trim()
    .min(1, "Enter a valid email.")
    .regex(EMAIL_RE, "Enter a valid email.")
    .max(200),
  company: z.string().trim().max(120, "That's a little long.").optional(),
  type: z.enum(PROJECT_TYPES),
  message: z
    .string()
    .trim()
    .min(1, "Add a few words so we can help.")
    .max(4000, "That's a little long."),
});

export type ContactInput = z.infer<typeof contactSchema>;
