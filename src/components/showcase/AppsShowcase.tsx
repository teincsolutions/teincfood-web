"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ProductShowcase } from "@/components/showcase/ProductShowcase";
import { getScreen, type ScreenKey } from "@/config/screens";

const TABS = [
  {
    id: "customer",
    screens: [
      "buyer:home",
      "buyer:cart",
      "buyer:checkout",
      "buyer:orders",
      "buyer:dish",
      "buyer:help",
    ] as ScreenKey[],
  },
  {
    id: "merchant",
    screens: [
      "business:orders",
      "business:menu",
      "business:earnings",
      "business:dashboard",
      "business:analytics",
      "business:wallet",
      "business:menus",
      "business:pos-checkout",
      "business:support-chat",
      "business:operating-hours",
      "business:delivery-settings",
      "business:tax-settings",
      "business:manage-categories",
      "business:edit-menu",
      "business:chat",
      "business:details",
      "desktop:dashboard",
      "desktop:pos",
      "desktop:pos-orders",
      "desktop:kitchen",
      "desktop:menu",
      "desktop:menu-create",
      "desktop:support",
      "desktop:messages",
      "desktop:team",
      "desktop:delivery",
      "desktop:orders",
      "desktop:analytics",
    ] as ScreenKey[],
  },
  {
    id: "rider",
    screens: [
      "rider:dashboard",
      "rider:delivery",
      "rider:earnings",
      "rider:navigate-pickup",
      "rider:navigate-dropoff",
      "rider:vehicle",
    ] as ScreenKey[],
  },
  {
    id: "fleet",
    screens: [
      "desktop:dashboard",
      "desktop:delivery",
      "desktop:analytics",
      "desktop:team",
      "desktop:orders",
      "business:dashboard",
      "business:analytics",
    ] as ScreenKey[],
  },
] as const;

export function AppsShowcase() {
  const t = useTranslations("showcase");
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("customer");

  const screens = useMemo(() => {
    const tab = TABS.find((item) => item.id === active) ?? TABS[0];
    // Show only real screenshots: never render placeholder slots.
    return tab.screens.filter((key) => Boolean(getScreen(key).image));
  }, [active]);

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label={t("controls.deviceLabel")}
        className="flex flex-wrap gap-2"
      >
        {TABS.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tab.id)}
              className={
                selected
                  ? "inline-flex min-h-11 items-center rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white"
                  : "inline-flex min-h-11 items-center rounded-xl border border-navy/15 bg-white px-4 py-2 text-sm font-semibold text-navy/75 transition-colors hover:border-navy/35 hover:text-navy"
              }
            >
              {t(`tabs.${tab.id}`)}
            </button>
          );
        })}
      </div>

      {screens.length > 0 ? (
        <ProductShowcase key={active} screenKeys={screens} />
      ) : (
        <p className="rounded-xl border border-navy/10 bg-surface p-6 text-sm text-navy/65">
          {t("controls.placeholder")}
        </p>
      )}
    </div>
  );
}
