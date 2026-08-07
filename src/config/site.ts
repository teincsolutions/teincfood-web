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
  name: "TeincFood",
  tagline: "Food delivery, reimagined",
  description:
    "Order from your favorite local restaurants or grow your own — TeincFood connects buyers, businesses, and riders on one fast, reliable food delivery platform.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@teincfood.com",
  analyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || "",
  deleteAccountPath: "/delete-account",
  logoVersion: process.env.NEXT_PUBLIC_LOGO_VERSION ?? "1",
};

export const authConfig = {
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  appleClientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
};

export type { Locale };
export type Locales = typeof locales;
