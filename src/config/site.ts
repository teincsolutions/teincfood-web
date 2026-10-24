import type { Locale, locales } from "./i18n";

export type AppName = "teincfood" | "teincfoodBusiness";

export interface AppLinks {
  appStore: string;
  playStore: string;
}

export interface StoreLinks {
  buyer: AppLinks;
  business: AppLinks;
}

function env(name: string): string {
  return process.env[name] ?? "";
}

export const storeLinks: StoreLinks = {
  buyer: {
    appStore: env("NEXT_PUBLIC_BUYER_APP_STORE"),
    playStore: env("NEXT_PUBLIC_BUYER_PLAY_STORE"),
  },
  business: {
    appStore: env("NEXT_PUBLIC_BUSINESS_APP_STORE"),
    playStore: env("NEXT_PUBLIC_BUSINESS_PLAY_STORE"),
  },
};

export const siteConfig = {
  name: "Teinc Food",
  tagline: "Food delivery, reimagined",
  description:
    "Order from your favorite local restaurants or grow your own — Teinc Food connects buyers, businesses, and riders on one fast, reliable food delivery platform.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@teincfood.com",
  analyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || "",
  deleteAccountPath: "/delete-account",
  logoVersion: process.env.NEXT_PUBLIC_LOGO_VERSION ?? "2",
};

export const authConfig = {
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  appleClientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
};

/**
 * Public guest chat (the floating widget).
 *
 * `turnstileSiteKey` is the Cloudflare Turnstile PUBLIC site key — the same
 * key pair the backend verifies with `GUEST_CAPTCHA_SECRET`. When it is
 * empty the captcha box is not rendered and the guest flow stays open, which
 * is what local development and the open test backend use.
 *
 * `apiBase` / `wsBase` point the widget at the right backend per
 * environment. They default to the testing backend so a misconfigured
 * deployment still talks to a working backend rather than to itself.
 */
export const chatConfig = {
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "",
  apiBase: process.env.NEXT_PUBLIC_API_URL || "https://testing-food.teincsolutions.com/api/v1",
  wsBase: process.env.NEXT_PUBLIC_WS_URL || "wss://testing-food.teincsolutions.com/ws",
};

export type { Locale };
export type Locales = typeof locales;
