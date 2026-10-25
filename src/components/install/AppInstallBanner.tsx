"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowUpRight,
  Download,
  ShoppingBag,
  Smartphone,
  Store,
  X,
} from "lucide-react";
import {
  mobileApps,
  type MobileAppConfig,
} from "@/config/site";
import { trackEvent } from "@/utils/observability";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "teincfood-install-dismissed";

type Platform = "ios" | "android" | "desktop" | "unknown";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "unknown";
  const ua = window.navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

/**
 * Deep-link into a native app, falling back to the store when it is not
 * installed. Android uses an intent:// URL with a browser fallback; iOS uses
 * the app's custom scheme and redirects to the App Store when the page stays
 * visible.
 */
function openApp(app: MobileAppConfig, platform: Platform) {
  trackEvent("install.app_open_attempted", {
    app: app.id,
    platform,
    package_name: app.packageName,
  });

  if (platform === "android") {
    const store = app.playStore || app.appStore;
    const fallback = store
      ? `S.browser_fallback_url=${encodeURIComponent(store)};`
      : "";
    window.location.href = `intent://#Intent;scheme=${app.scheme};package=${app.packageName};${fallback}end`;
    return;
  }

  if (platform === "ios") {
    const store = app.appStore || app.playStore;
    const startedAt = Date.now();
    window.location.href = `${app.scheme}://`;
    if (store) {
      window.setTimeout(() => {
        if (
          document.visibilityState === "visible" &&
          Date.now() - startedAt < 2000
        ) {
          window.location.href = store;
        }
      }, 1200);
    }
  }
}

export function AppInstallBanner() {
  const t = useTranslations("install");
  const [platform] = useState<Platform>(detectPlatform);
  const [visible, setVisible] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (platform !== "ios" && platform !== "android") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    trackEvent("install.banner_shown", { platform });
  }, [platform]);

  if (!visible || (platform !== "ios" && platform !== "android")) return null;

  const dismiss = () => {
    setVisible(false);
    setDialogOpen(false);
    localStorage.setItem(STORAGE_KEY, "1");
    trackEvent("install.dismissed", { platform });
  };

  const openChooser = () => {
    setDialogOpen(true);
    trackEvent("install.dialog_opened", { platform });
  };

  const apps = [mobileApps.buyer, mobileApps.business];

  return (
    <>
      <aside
        role="region"
        aria-label={t("bannerRegion")}
        className="relative z-40 border-b border-white/10 bg-navy text-white"
      >
        <div className="container-site flex items-start gap-3 py-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Smartphone className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-tight">{t("bannerTitle")}</p>
            <p className="mt-0.5 text-xs leading-snug text-white/70">
              {t("bannerBody")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openChooser}
                className="inline-flex min-h-9 items-center justify-center rounded-lg bg-orange-800 px-3 text-xs font-bold text-white transition-colors hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {t("openAction")}
              </button>
              <button
                type="button"
                onClick={openChooser}
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-white/20 px-3 text-xs font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Download className="size-3.5" aria-hidden="true" />
                {t("installAction")}
              </button>
            </div>
          </div>
          <button
            type="button"
            aria-label={t("dismiss")}
            onClick={dismiss}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </aside>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-navy/60 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out data-[state=open]:fade-in" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-navy/10 bg-white p-5 shadow-2xl outline-none">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Dialog.Title className="text-lg font-extrabold text-navy">
                  {t("dialogTitle")}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm leading-relaxed text-navy/60">
                  {t("dialogDescription")}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label={t("dismiss")}
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-navy/50 transition-colors hover:bg-navy/5 hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <div className="mt-4 space-y-3">
              {apps.map((app) => {
                const Icon = app.id === "buyer" ? ShoppingBag : Store;
                const installUrl =
                  platform === "ios" ? app.appStore : app.playStore;
                const appName =
                  app.id === "buyer" ? t("buyerApp") : t("businessApp");
                const tagline =
                  app.id === "buyer"
                    ? t("buyerTagline")
                    : t("businessTagline");

                return (
                  <div
                    key={app.id}
                    className="rounded-xl border border-navy/10 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl text-white",
                          app.id === "buyer" ? "bg-orange-800" : "bg-navy",
                        )}
                      >
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-navy">{appName}</p>
                        <p className="text-xs leading-relaxed text-navy/60">
                          {tagline}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          openApp(app, platform);
                          setDialogOpen(false);
                        }}
                        className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-orange-800 px-3 text-xs font-bold text-white transition-colors hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
                      >
                        {t("openLabel")}
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </button>
                      {installUrl ? (
                        <a
                          href={installUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            trackEvent("install.store_clicked", {
                              app: app.id,
                              platform,
                            });
                            setDialogOpen(false);
                          }}
                          className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-navy/15 px-3 text-xs font-bold text-navy transition-colors hover:border-navy/35 hover:bg-navy/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                        >
                          <Download
                            className="size-3.5"
                            aria-hidden="true"
                          />
                          {t("installLabel")}
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-navy/45">
              {t("fallbackNote")}
            </p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
