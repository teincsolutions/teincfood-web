"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Store, Smartphone } from "lucide-react";
import { storeLinks } from "@/config/site";

function detectPlatform(): "ios" | "android" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  return "desktop";
}

export function BizLanding({
  businessName,
  businessNumber,
}: {
  businessName: string;
  businessNumber: string;
}) {
  const t = useTranslations("biz");
  const platform = useMemo(() => detectPlatform(), []);

  // Re-trigger the universal link — opens the Teinc Food buyer app when
  // installed (in-app browsers often don't resolve applinks themselves).
  const universalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/biz/${businessNumber}`
      : `/biz/${businessNumber}`;

  const storeUrl =
    platform === "ios"
      ? storeLinks.buyer.appStore
      : platform === "android"
        ? storeLinks.buyer.playStore
        : "";

  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-orange/10 text-orange">
        <Store className="size-7" aria-hidden />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-navy sm:text-3xl">
        {businessName}
      </h1>
      <p className="mt-3 max-w-md text-navy/70">{t("intro")}</p>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <a
          href={universalUrl}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-orange px-6 font-semibold text-white transition-colors hover:bg-orange-700"
        >
          <Smartphone className="size-5" aria-hidden />
          {t("openApp")}
        </a>
        {storeUrl ? (
          <a
            href={storeUrl}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-navy/15 px-6 font-semibold text-navy transition-colors hover:border-navy/30"
          >
            {t("getApp")}
          </a>
        ) : null}
      </div>

      <ol className="mt-10 flex w-full max-w-md flex-col gap-3 text-left">
        {[t("step1"), t("step2"), t("step3")].map((step, i) => (
          <li key={i} className="flex gap-3 text-sm text-navy/70">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy/10 text-xs font-bold text-navy">
              {i + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
