import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarClock, Navigation, Wallet } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { StepsSection } from "@/components/sections/StepsSection";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { RoleDownloadCta } from "@/components/home/RoleDownloadCta";
import { ProductShowcase } from "@/components/showcase/ProductShowcase";
import { Section } from "@/components/ui/Section";
import { localizeMetadata } from "@/lib/seo";

const riderScreens = [
  "rider:dashboard",
  "rider:delivery",
  "rider:earnings",
  "rider:navigate-pickup",
  "rider:navigate-dropoff",
  "rider:vehicle",
] as const;

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
        primaryAction={{ href: "/download?app=business", label: t("cta") }}
        secondaryAction={{ href: "#screens", label: t("secondary") }}
        screenKey="rider:dashboard"
        device="iphone"
      />
      <StepsSection ns="rider.steps" />
      <FeatureCards
        ns="rider.features"
        icons={[CalendarClock, Wallet, Navigation]}
      />
      <Section id="screens" className="bg-white">
        <ProductShowcase screenKeys={riderScreens} />
      </Section>
      <RoleDownloadCta audience="business" />
    </>
  );
}
