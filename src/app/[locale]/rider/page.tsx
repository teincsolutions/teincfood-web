import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CalendarClock, Wallet, Navigation } from "lucide-react";
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
  const t = await getTranslations({ locale, namespace: "meta.rider" });
  return localizeMetadata({
    locale,
    path: "/rider",
    title: t("title"),
    description: t("description"),
    images: ["/icon.png"],
  });
}

export default async function RiderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "rider.hero" });

  return (
    <>
      <Hero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        storeLinks={storeLinks.business}
        screenKey="rider:delivery"
        reverse
      />
      <StepsSection ns="rider.steps" />
      <FeatureCards
        ns="rider.features"
        icons={[CalendarClock, Wallet, Navigation]}
      />
      <InstallCta />
    </>
  );
}