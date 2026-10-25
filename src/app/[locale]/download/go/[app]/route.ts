import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "@/config/i18n";
import { siteConfig, storeLinks, type MobileAppId } from "@/config/site";

export const dynamic = "force-dynamic";

function isMobileAppId(value: string): value is MobileAppId {
  return value === "buyer" || value === "business";
}

/**
 * Store-aware download redirect used by the QR codes.
 *
 * A phone camera opens this endpoint; iOS devices go to the App Store,
 * Android devices go to Google Play, and anything else falls back to the
 * localized download page. Missing store URLs fall back to the page too.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string; app: string }> },
) {
  const { locale: rawLocale, app } = await params;
  const requestedLocale =
    request.nextUrl.searchParams.get("locale") ?? rawLocale;
  const locale: Locale = locales.includes(requestedLocale as Locale)
    ? (requestedLocale as Locale)
    : defaultLocale;

  if (!isMobileAppId(app)) {
    return NextResponse.redirect(new URL(`/${locale}/apps`, siteConfig.url));
  }

  const fallback = new URL(`/${locale}/download?app=${app}`, siteConfig.url);
  const userAgent = request.headers.get("user-agent") ?? "";
  const stores = storeLinks[app];

  const target = /iPhone|iPad|iPod/i.test(userAgent)
    ? stores.appStore
    : /Android/i.test(userAgent)
      ? stores.playStore
      : "";

  return NextResponse.redirect(target || fallback);
}
