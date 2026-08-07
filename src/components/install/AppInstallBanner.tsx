"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Apple, Play, X } from "lucide-react";
import { storeLinks } from "@/config/site";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "teincfood-install-dismissed";

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "desktop";
  const ua = window.navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "desktop";
}

export function AppInstallBanner() {
  const t = useTranslations("install");
  const [platform] = useState<Platform>(detectPlatform);
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = window.setTimeout(() => setVisible(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else if (platform === "android" && storeLinks.buyer.playStore) {
      window.open(storeLinks.buyer.playStore, "_blank", "noopener");
    } else if (platform === "ios" && storeLinks.buyer.appStore) {
      window.open(storeLinks.buyer.appStore, "_blank", "noopener");
    }
    dismiss();
  };

  if (!visible) return null;

  const storeUrl =
    platform === "ios" ? storeLinks.buyer.appStore : storeLinks.buyer.playStore;

  return (
    <aside
      id="install"
      role="region"
      aria-label="Download TeincFood"
      className={cn(
        "fixed inset-x-0 z-50 mx-auto w-full max-w-md px-4",
        "bottom-4",
      )}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-navy/10 bg-white p-3 shadow-xl shadow-navy/10">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange text-white">
          <Apple className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-navy">TeincFood</p>
          <p className="text-xs text-navy/60">Food delivery, reimagined</p>
        </div>
        {deferredPrompt || platform === "android" ? (
          <button
            type="button"
            onClick={handleInstall}
            className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full bg-orange px-4 text-sm font-bold text-white transition-colors hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <Play className="size-4 fill-current" aria-hidden="true" />
            Install
          </button>
        ) : storeUrl ? (
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full bg-orange px-4 text-sm font-bold text-white transition-colors hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            <Apple className="size-4" aria-hidden="true" />
            Download
          </a>
        ) : null}
        <button
          type="button"
          aria-label={t("dismiss")}
          onClick={dismiss}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-navy/50 transition-colors hover:bg-navy/5 hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}

// Keep type local & typed to avoid global pollution
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string; platform: string }>;
};
