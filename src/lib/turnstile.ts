/**
 * Public Cloudflare Turnstile site key — safe to ship to the browser.
 * Overridable via NEXT_PUBLIC_TURNSTILE_SITE_KEY (e.g. Cloudflare's
 * always-passes test key `1x00000000000000000000AA` in e2e).
 */
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "0x4AAAAAADYEqYheA4g5SDN4";
