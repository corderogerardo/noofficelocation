import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const TURNSTILE = "https://challenges.cloudflare.com";

/**
 * Security response headers. CSP allows inline styles (React `style={{…}}` and
 * the gradient tokens) and inline scripts (Next's hydration bootstrap), plus
 * Cloudflare Turnstile (script + iframe) for the contact form's bot check.
 *
 * In development, Next's dev runtime (React dev build + Turbopack/HMR) requires
 * `'unsafe-eval'` and a WebSocket connection — added for dev only so production
 * stays strict (React never uses eval in production).
 */
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  TURNSTILE,
  ...(isDev ? ["'unsafe-eval'"] : []),
];

const connectSrc = ["'self'", TURNSTILE, ...(isDev ? ["ws:", "wss:"] : [])];

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  `script-src ${scriptSrc.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `frame-src ${TURNSTILE}`,
  `connect-src ${connectSrc.join(" ")}`,
  "frame-ancestors 'none'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
