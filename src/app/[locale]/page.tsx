import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { RolesSection } from "@/components/home/RolesSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CitiesSection } from "@/components/home/CitiesSection";
import { InstallCta } from "@/components/home/InstallCta";
import { WhatsAppSection } from "@/components/home/WhatsAppSection";
import { DesktopSection } from "@/components/home/DesktopSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { storeLinks, siteConfig } from "@/config/site";
import { localizeMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.default" });

  return localizeMetadata({
    locale,
    path: "",
    title: t("title"),
    description: t("description"),
    images: ["/icon.png"],
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home.hero" });

  const orgJson = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };

  return (
    <>
      <JsonLd data={orgJson} />
      <Hero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        storeLinks={storeLinks.buyer}
        screenKey="buyer:home"
      />
      <RolesSection />
      <HowItWorks />
      <FeaturesSection />
      <WhatsAppSection />
      <DesktopSection />
      <CitiesSection />
      <InstallCta />
    </>
  );
}