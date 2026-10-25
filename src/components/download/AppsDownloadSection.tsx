"use client";

import { useLocale, useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { QrCode } from "@/components/install/QrCode";
import { StoreButton } from "@/components/download/StoreButton";
import { siteConfig, storeLinks, type MobileAppId } from "@/config/site";

const APPS: {
  id: MobileAppId;
  audienceKey: "forCustomers" | "forRidersSellers";
  nameKey: "buyerApp" | "businessApp";
  taglineKey: "buyerTagline" | "businessTagline";
}[] = [
  {
    id: "buyer",
    audienceKey: "forCustomers",
    nameKey: "buyerApp",
    taglineKey: "buyerTagline",
  },
  {
    id: "business",
    audienceKey: "forRidersSellers",
    nameKey: "businessApp",
    taglineKey: "businessTagline",
  },
];

export function AppsDownloadSection() {
  const t = useTranslations("download");
  const it = useTranslations("install");
  const locale = useLocale();
  const baseUrl = siteConfig.url.replace(/\/+$/, "");

  return (
    <Section id="download" className="bg-surface">
      <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-10 text-white sm:px-10 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-orange/20 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
            {t("appsEyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("appsTitle")}
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-white/65">
            {t("appsSubtitle")}
          </p>
        </div>

        <div className="relative mt-8 grid gap-4 lg:grid-cols-2">
          {APPS.map((app) => {
            const stores = storeLinks[app.id];
            const qrUrl = `${baseUrl}/${locale}/download/go/${app.id}`;

            return (
              <div
                key={app.id}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-orange-300">
                  {it(app.audienceKey)}
                </p>
                <h3 className="mt-2 text-xl font-extrabold">
                  {it(app.nameKey)}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">
                  {it(app.taglineKey)}
                </p>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 flex-col gap-2">
                    <StoreButton
                      kind="apple"
                      href={stores.appStore}
                      label={t("mobile.appStore")}
                      soonLabel={t("mobile.appStoreSoon")}
                      tone="light"
                      className="w-full"
                    />
                    <StoreButton
                      kind="play"
                      href={stores.playStore}
                      label={t("mobile.playStore")}
                      soonLabel={t("mobile.playStoreSoon")}
                      tone="light"
                      className="w-full"
                    />
                  </div>

                  <div className="flex shrink-0 flex-col items-center gap-2">
                    <QrCode
                      value={qrUrl}
                      size={112}
                      label={t("scan")}
                      className="border border-white/10 shadow-lg shadow-black/20"
                    />
                    <p className="max-w-[8rem] text-center text-[11px] leading-tight text-white/55">
                      {t("scan")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
