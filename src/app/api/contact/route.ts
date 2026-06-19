import { NextResponse } from "next/server";
import { Resend } from "resend";

import { contactSchema } from "@/lib/validation/contact";

interface CfEnv {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const MAX_BODY_BYTES = 16_000;
const MIN_SUBMIT_MS = 3_000;
const MAX_LINKS = 4;
const RATE_LIMIT = 5;
const RATE_WINDOW_SEC = 60;
const TURNSTILE_VERIFY =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Cloudflare bindings/secrets/vars (falls back to process.env off-Cloudflare). */
async function getCfEnv(): Promise<CfEnv> {
  try {
    const moduleName = "cloudflare:workers";
    const mod = (await import(/* @vite-ignore */ moduleName)) as {
      env?: CfEnv;
    };
    if (mod.env) return mod.env;
  } catch {
    /* not running on workerd */
  }
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    return getCloudflareContext().env as unknown as CfEnv;
  } catch {
    return process.env as unknown as CfEnv;
  }
}

function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/**
 * Fixed-window per-IP rate limit using the Workers Cache API (free, per-colo).
 * Fails open if the Cache API is unavailable (e.g. local Node).
 */
async function withinRateLimit(ip: string): Promise<boolean> {
  if (typeof caches === "undefined") return true;
  const cache = (caches as unknown as { default?: Cache }).default;
  if (!cache) return true;
  try {
    const windowStart = Math.floor(Date.now() / 1000 / RATE_WINDOW_SEC);
    const key = new Request(
      `https://ratelimit.local/contact/${encodeURIComponent(ip)}/${windowStart}`,
    );
    const hit = await cache.match(key);
    const count = hit ? Number(hit.headers.get("x-count") ?? "0") : 0;
    if (count >= RATE_LIMIT) return false;
    await cache.put(
      key,
      new Response("", {
        headers: {
          "x-count": String(count + 1),
          "Cache-Control": `max-age=${RATE_WINDOW_SEC}`,
        },
      }),
    );
    return true;
  } catch {
    return true;
  }
}

async function verifyTurnstile(
  token: string,
  secret: string,
  ip: string,
): Promise<boolean> {
  const form = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "unknown") form.set("remoteip", ip);
  try {
    const res = await fetch(TURNSTILE_VERIFY, { method: "POST", body: form });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

/**
 * Contact endpoint with layered anti-abuse:
 * Content-Type + size cap → per-IP rate limit → honeypot → min-submit-time →
 * Turnstile → zod validation → link-spam heuristic → Resend send.
 */
export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return fail("Unsupported content type.", 415);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return fail("Request too large.", 413);

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return fail("Malformed request.", 400);
  }

  const ip = clientIp(request);

  // Per-IP rate limit (Cache API; per-colo, approximate).
  if (!(await withinRateLimit(ip))) {
    return fail("Too many requests. Please try again in a minute.", 429);
  }

  // Honeypot — bots fill hidden fields. Accept silently, but drop.
  const website = typeof payload.website === "string" ? payload.website : "";
  if (website.trim() !== "") return NextResponse.json({ ok: true });

  // Min time-to-submit — instant submits are bots. Drop silently.
  const ts = typeof payload.ts === "number" ? payload.ts : 0;
  if (ts > 0 && Date.now() - ts < MIN_SUBMIT_MS) {
    return NextResponse.json({ ok: true });
  }

  const env = await getCfEnv();

  // Turnstile (required once the secret is configured).
  if (env.TURNSTILE_SECRET_KEY) {
    const token =
      typeof payload.turnstileToken === "string" ? payload.turnstileToken : "";
    if (!token) return fail("Please complete the verification.", 400);
    if (!(await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip))) {
      return fail("Verification failed. Please try again.", 403);
    }
  }

  // Validate content (unknown keys like website/ts/turnstileToken are stripped).
  const result = contactSchema.safeParse(payload);
  if (!result.success) {
    return fail("Please check the form and try again.", 422);
  }
  const data = result.data;

  // Lightweight spam heuristic — too many links.
  const linkCount = (data.message.match(/https?:\/\//gi) ?? []).length;
  if (linkCount > MAX_LINKS) return fail("Your message looks like spam.", 422);

  console.info("[contact] pitch received", { type: data.type });

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.info("[contact] RESEND_API_KEY not set; skipping email send");
    return NextResponse.json({ ok: true });
  }

  const to = env.CONTACT_TO || "gerardo@noofficelocation.com";
  const from = env.CONTACT_FROM || "No Office Location <onboarding@resend.dev>";
  // Strip CR/LF from header-bound fields (defense-in-depth vs header injection).
  const safeName = data.name.replace(/[\r\n]+/g, " ").slice(0, 100);
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.company ? `Company: ${data.company}` : null,
    `Project type: ${data.type}`,
    "",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject: `New pitch from ${safeName}${data.company ? ` · ${data.company}` : ""}`,
      text,
    });
    if (error) throw new Error(error.message ?? "Resend error");
  } catch (error) {
    // Log only the message string — never the raw error object — so a provider
    // error can't carry a credential into the Worker logs.
    console.error(
      "[contact] email send failed:",
      error instanceof Error ? error.message : "unknown error",
    );
    return fail("We couldn't send your message. Please try again.", 502);
  }

  return NextResponse.json({ ok: true });
}
