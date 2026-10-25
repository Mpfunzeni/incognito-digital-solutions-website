import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy. Google Analytics hosts are allowed so GA4 works once
// NEXT_PUBLIC_GA_MEASUREMENT_ID is set and the visitor has consented.
// 'unsafe-inline' for scripts keeps pages statically generated (nonces would
// force every page to render per request). Tighten this if you add a CSP nonce.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  // PayFast checkout is a form post to PayFast's payment page.
  "form-action 'self' https://www.payfast.co.za https://sandbox.payfast.co.za",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

// Indexing is only allowed on the production deployment. Every other
// environment (preview, staging, local) sends a noindex header as a safety net.
// Mirrors allowIndexing in src/lib/seo.ts.
const allowIndexing =
  process.env.NEXT_PUBLIC_SITE_ENV === "production" ||
  (!process.env.NEXT_PUBLIC_SITE_ENV && process.env.VERCEL_ENV === "production");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Database drivers run on the server only and are not bundled.
  serverExternalPackages: ["postgres", "@electric-sql/pglite"],
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    const headers = [...securityHeaders];
    if (!allowIndexing) headers.push({ key: "X-Robots-Tag", value: "noindex, nofollow" });
    return [{ source: "/:path*", headers }];
  },
  // Permanent redirects for URLs that change. Add old site paths here when
  // they are known, so existing links and search results keep working.
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/quote", destination: "/get-a-quote", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-and-conditions", permanent: true },
      { source: "/services/website-design", destination: "/services/web-design", permanent: true },
      { source: "/services/hosting", destination: "/services/web-hosting-domains", permanent: true },
      { source: "/services/ecommerce", destination: "/services/ecommerce-development", permanent: true },
    ];
  },
};

export default nextConfig;
