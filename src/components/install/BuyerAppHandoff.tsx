"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Smartphone } from "lucide-react";
import { storeLinks } from "@/config/site";
import {
  buyerAppHref,
  buyerIntentUrl,
  buyerSchemeUrl,
  detectMobilePlatform,
  type MobilePlatform,
} from "@/lib/mobile-app-links";

/**
 * Fast handoff from a shared web URL to the buyer app.
 *
 * The page around this component is still server-rendered for SEO and for
 * desktop visitors. On a phone we try the native app immediately:
 *   - Android: an intent:// URL with a Play Store fallback.
 *   - iOS: a hidden custom-scheme probe, because in-app browsers do not
 *     always resolve universal links. A visible button remains as fallback.
 *
 * The attempt is made once per tab/path so closing the app and coming back
 * does not bounce the visitor into it again.
 */
export function BuyerAppHandoff({
  path,
  autoOpen = true,
}: {
  path: string;
  autoOpen?: boolean;
}) {
  const t = useTranslations("install");
  const [platform, setPlatform] = useState<Exclude<
    MobilePlatform,
    "desktop"
  > | null>(null);
  const attempted = useRef(false);

  useEffect(() => {
    const detected = detectMobilePlatform();
    if (detected === "desktop") return;

    // Defer the render update so this effect only drives external systems
    // (intent URL / custom-scheme probe) synchronously.
    const stateTimer = window.setTimeout(() => setPlatform(detected), 0);
    const clearStateTimer = () => window.clearTimeout(stateTimer);

    if (!autoOpen || attempted.current) return clearStateTimer;
    attempted.current = true;

    try {
      const key = `teincfood-app-handoff:${path}`;
      if (window.sessionStorage.getItem(key)) return clearStateTimer;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // Storage can be blocked in private/in-app browsers; still attempt.
    }

    if (detected === "android") {
      const navigationTimer = window.setTimeout(() => {
        window.location.href = buyerIntentUrl(path);
      }, 200);

      return () => {
        clearStateTimer();
        window.clearTimeout(navigationTimer);
      };
    }

    // iOS: probing with a hidden iframe avoids Safari's "invalid address"
    // alert when the app is not installed. If the app is installed it opens
    // before the fallback banner is ever used.
    const frame = document.createElement("iframe");
    frame.style.display = "none";
    frame.src = buyerSchemeUrl(path);
    document.body.appendChild(frame);

    const cleanup = window.setTimeout(() => frame.remove(), 1500);
    return () => {
      clearStateTimer();
      window.clearTimeout(cleanup);
      frame.remove();
    };
  }, [autoOpen, path]);

  if (!platform) return null;

  const storeUrl =
    platform === "ios" ? storeLinks.buyer.appStore : storeLinks.buyer.playStore;

  return (
    <div className="border-b border-orange/20 bg-orange/5">
      <div className="container-site flex flex-wrap items-center justify-between gap-3 py-2.5">
        <span className="flex items-center gap-2 text-sm font-semibold text-navy">
          <Smartphone className="size-4 text-orange" aria-hidden />
          {t("openingApp")}
        </span>
        <span className="flex items-center gap-2">
          <a
            href={buyerAppHref(platform, path)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-orange px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
          >
            {t("open")}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
          {storeUrl ? (
            <a
              href={storeUrl}
              className="inline-flex min-h-9 items-center rounded-full border border-navy/15 px-4 text-sm font-semibold text-navy transition-colors hover:border-navy/30"
            >
              {t("installLabel")}
            </a>
          ) : null}
        </span>
      </div>
    </div>
  );
}
