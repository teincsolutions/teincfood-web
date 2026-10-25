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

export type MobileAppId = "buyer" | "business";

const defaultBundleIds: Record<MobileAppId, string> = {
  buyer: "com.teincfood.app",
  business: "com.teincfood.business",
};

function playStoreUrl(packageName: string): string {
  return `https://play.google.com/store/apps/details?id=${packageName}`;
}

/**
 * Public store links.
 *
 * Play Store URLs fall back to the known package names so the download page
 * still works when the CI variables are not configured. App Store URLs have
 * no safe fallback: set the real listing URLs before launch, otherwise the
 * UI shows an "App Store — coming soon" state.
 */
export const storeLinks: StoreLinks = {
  buyer: {
    appStore: env("NEXT_PUBLIC_BUYER_APP_STORE"),
    playStore:
      env("NEXT_PUBLIC_BUYER_PLAY_STORE") ||
      playStoreUrl(defaultBundleIds.buyer),
  },
  business: {
    appStore: env("NEXT_PUBLIC_BUSINESS_APP_STORE"),
    playStore:
      env("NEXT_PUBLIC_BUSINESS_PLAY_STORE") ||
      playStoreUrl(defaultBundleIds.business),
  },
};

export interface MobileAppConfig {
  id: MobileAppId;
  /** iOS bundle identifier (also used in the Apple association file). */
  bundleId: string;
  /** Android application id / package name. */
  packageName: string;
  /** Custom URL scheme declared by the native app. */
  scheme: string;
  appStore: string;
  playStore: string;
}

const defaultSchemes: Record<MobileAppId, string> = {
  buyer: "teincfood",
  business: "teincfoodbusiness",
};

function publicEnv(name: string): string {
  return process.env[name] ?? "";
}

/**
 * Deep-link metadata for the two native apps.
 *
 * Bundle ids, package names and URL schemes are public, so they are safe to
 * ship in the browser bundle. Override them per environment when the native
 * apps use different values.
 */
export const mobileApps: Record<MobileAppId, MobileAppConfig> = {
  buyer: {
    id: "buyer",
    bundleId:
      publicEnv("NEXT_PUBLIC_BUYER_BUNDLE_ID") || defaultBundleIds.buyer,
    packageName:
      publicEnv("NEXT_PUBLIC_BUYER_PACKAGE") || defaultBundleIds.buyer,
    scheme:
      publicEnv("NEXT_PUBLIC_BUYER_APP_SCHEME") || defaultSchemes.buyer,
    ...storeLinks.buyer,
  },
  business: {
    id: "business",
    bundleId:
      publicEnv("NEXT_PUBLIC_BUSINESS_BUNDLE_ID") || defaultBundleIds.business,
    packageName:
      publicEnv("NEXT_PUBLIC_BUSINESS_PACKAGE") || defaultBundleIds.business,
    scheme:
      publicEnv("NEXT_PUBLIC_BUSINESS_APP_SCHEME") || defaultSchemes.business,
    ...storeLinks.business,
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
  whatsappUrl:
    process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/233503981913",
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

/**
 * Telemetry collector for the shared observability layer.
 *
 * `url` and `key` must belong to the same collector — each environment has
 * its own ingest key and the wrong pairing is rejected with 401.
 *
 * `env` is the label attached to every event so dashboards can filter by
 * environment. It has to be one of the values the library accepts:
 * development | testing | staging | production.
 */
export const telemetryConfig = {
  url: process.env.NEXT_PUBLIC_TELEMETRY_URL || "",
  key: process.env.NEXT_PUBLIC_TELEMETRY_KEY || "",
  env: (process.env.NEXT_PUBLIC_TELEMETRY_ENV || "development") as
    | "development"
    | "testing"
    | "staging"
    | "production",
};

export type { Locale };
export type Locales = typeof locales;
