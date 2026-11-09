import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** Origin (scheme + host) of a URL, or null when it is unset/invalid. */
function originOf(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

/**
 * The CSP has to list the same origins the app actually talks to, otherwise
 * the browser silently blocks them:
 *  - the API + websocket of the chat widget (NEXT_PUBLIC_API_URL / WS_URL)
 *  - the telemetry collector (NEXT_PUBLIC_TELEMETRY_URL)
 *  - Cloudflare Turnstile, which runs the guest-chat captcha
 *  - Cloudflare Web Analytics, whose beacon is injected into the HTML by
 *    Cloudflare's own edge and would otherwise be blocked as a third-party
 *    script (it loads from static.cloudflareinsights.com and reports to
 *    cloudflareinsights.com).
 */
function contentSecurityPolicy(): string {
  const connect: string[] = ["'self'"];

  for (const value of [
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_WS_URL,
    process.env.NEXT_PUBLIC_TELEMETRY_URL,
  ]) {
    const origin = originOf(value);
    if (origin && !connect.includes(origin)) connect.push(origin);
  }

  connect.push("https://challenges.cloudflare.com");
  connect.push("https://*.challenges.cloudflare.com");
  connect.push("https://cloudflareinsights.com");
  connect.push("https://accounts.google.com");
  connect.push("https://appleid.apple.com");

  return (
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' " +
    (process.env.NODE_ENV === "production" ? "" : "'unsafe-eval' ") +
    "https://challenges.cloudflare.com " +
    "https://static.cloudflareinsights.com " +
    "https://accounts.google.com " +
    "https://appleid.cdn-apple.com; " +
    "style-src 'self' 'unsafe-inline' https://accounts.google.com; " +
    "img-src 'self' data: https:; " +
    `connect-src ${connect.join(" ")}; ` +
    "frame-src https://challenges.cloudflare.com https://accounts.google.com https://appleid.apple.com; " +
    "font-src 'self' data:;"
  );
}

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    localPatterns: [
      { pathname: "/logo/*" },
      { pathname: "/screens/**" },
      { pathname: "/apps/*" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy(),
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
