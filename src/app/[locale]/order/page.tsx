import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Store, Radar, CreditCard } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { StepsSection } from "@/components/sections/StepsSection";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { InstallCta } from "@/components/home/InstallCta";
import { storeLinks } from "@/config/site";
import { localizeMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.order" });
  return localizeMetadata({
    locale,
    path: "/order",
    title: t("title"),
    description: t("description"),
    images: ["/icon.png"],
  });
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "order.hero" });

  return (
    <>
      <Hero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        storeLinks={storeLinks.buyer}
        screenKey="buyer:cart"
        reverse
      />
      <StepsSection ns="order.steps" withDescriptions={false} />
      <FeatureCards
        ns="order.features"
        icons={[Store, Radar, CreditCard]}
      />
      <InstallCta />
    </>
  );
}