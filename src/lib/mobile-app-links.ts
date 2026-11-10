import { mobileApps, storeLinks } from "@/config/site";

export type MobilePlatform = "ios" | "android" | "desktop";

/** The public universal-link host claimed by the buyer app. */
const APP_LINK_HOST = "teincfood.com";

export function detectMobilePlatform(): MobilePlatform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  return "desktop";
}

export function normalizeAppPath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

/** Canonical HTTPS URL that iOS/Android resolve as a universal link. */
export function buyerUniversalUrl(path: string): string {
  return `https://${APP_LINK_HOST}${normalizeAppPath(path)}`;
}

/** Custom-scheme URL for in-app browsers that do not resolve app links. */
export function buyerSchemeUrl(path: string): string {
  // Triple slash keeps the whole route in `pathname` so Expo Router maps it
  // to /biz/<number>, /order, etc. instead of treating the first segment as
  // the URL host.
  return `${mobileApps.buyer.scheme}://${normalizeAppPath(path)}`;
}

/** Android intent URL with a Play Store fallback when the app is absent. */
export function buyerIntentUrl(path: string): string {
  const route = normalizeAppPath(path);
  const fallback = encodeURIComponent(storeLinks.buyer.playStore);
  return `intent://${APP_LINK_HOST}${route}#Intent;scheme=https;package=${mobileApps.buyer.packageName};S.browser_fallback_url=${fallback};end`;
}

export function buyerAppHref(platform: MobilePlatform, path: string): string {
  if (platform === "android") return buyerIntentUrl(path);
  return buyerSchemeUrl(path);
}
