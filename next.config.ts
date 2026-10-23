import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    localPatterns: [{ pathname: "/logo/*" }, { pathname: "/screens/**" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://testing-food.teincsolutions.com wss://testing-food.teincsolutions.com https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; font-src 'self' data:;",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
