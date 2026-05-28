import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Security response headers. CSP allows inline styles (React `style={{…}}` and
 * the gradient tokens) and inline scripts (Next's hydration bootstrap). The
 * Three.js hero is plain WebGL on a <canvas> with no external assets.
 *
 * In development, Next's dev runtime (React dev build + Turbopack/HMR) requires
 * `'unsafe-eval'` and a WebSocket connection — these are added for dev only so
 * production stays strict (React never uses eval in production).
 */
const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(isDev ? ["'unsafe-eval'"] : []),
];

const connectSrc = ["'self'", ...(isDev ? ["ws:", "wss:"] : [])];

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  `script-src ${scriptSrc.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
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
