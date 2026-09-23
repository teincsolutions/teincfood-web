"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Apple, Play, X } from "lucide-react";
import { siteConfig, storeLinks } from "@/config/site";
import { trackEvent } from "@/utils/observability";
import { cn } from "@/lib/utils";
import { QrCode } from "@/components/install/QrCode";

const STORAGE_KEY = "teincfood-install-dismissed";

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "desktop";
  const ua = window.navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

function StoreButton({
  href,
  icon,
  top,
  label,
  store,
}: {
  href: string;
  icon: ReactNode;
  top: string;
  label: string;
  store: "app_store" | "play_store";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("install.store_clicked", { store })}
      className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-orange px-3 text-sm font-bold text-white transition-colors hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
    >
      {icon}
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[9px] uppercase tracking-wide opacity-80">{top}</span>
        <span className="text-sm">{label}</span>
      </span>
    </a>
  );
}

export function AppInstallBanner() {
  const t = useTranslations("install");
  const [platform] = useState<Platform>(detectPlatform);
  const [visible, setVisible] = useState(false);
  const isDesktop = platform === "desktop";

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = window.setTimeout(() => setVisible(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (visible) trackEvent("install.banner_shown", { platform });
  }, [visible, platform]);

  const dismiss = () => {
    setVisible(false);
    trackEvent("install.dismissed", { platform });
    localStorage.setItem(STORAGE_KEY, "1");
  };

  if (!visible) return null;

  const hasAnyLink = Boolean(
    storeLinks.buyer.appStore || storeLinks.buyer.playStore,
  );

  return (
    <aside
      id="install"
      role="region"
      aria-label="Download Teinc Food"
      className={cn(
        "fixed inset-x-0 z-50 mx-auto w-full max-w-md px-4",
        "bottom-4",
      )}
    >
      <div className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-4 shadow-xl shadow-navy/10">
        {isDesktop && siteConfig.url && (
          <div className="hidden shrink-0 sm:block">
            <QrCode value={siteConfig.url} size={96} />
            <p className="mt-1 text-center text-[10px] leading-tight text-navy/60">
              {t("scan")}
            </p>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange text-white">
              <Apple className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-navy">Teinc Food</p>
              <p className="truncate text-xs text-navy/60">
                Food delivery, reimagined
              </p>
            </div>
            <button
              type="button"
              aria-label={t("dismiss")}
              onClick={dismiss}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-navy/50 transition-colors hover:bg-navy/5 hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          {hasAnyLink && (
            <div className="mt-3 flex gap-2">
              {storeLinks.buyer.appStore && (
                <StoreButton
                  href={storeLinks.buyer.appStore}
                  icon={<Apple className="size-4" aria-hidden="true" />}
                  top={t("ios")}
                  label="App Store"
                  store="app_store"
                />
              )}
              {storeLinks.buyer.playStore && (
                <StoreButton
                  href={storeLinks.buyer.playStore}
                  icon={<Play className="size-4 fill-current" aria-hidden="true" />}
                  top={t("android")}
                  label="Google Play"
                  store="play_store"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}