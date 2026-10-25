import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { RolesSection } from "@/components/home/RolesSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CitiesSection } from "@/components/home/CitiesSection";
import { RoleDownloadCta } from "@/components/home/RoleDownloadCta";
import { PlatformStrip } from "@/components/home/PlatformStrip";
import { ProductShowcase } from "@/components/showcase/ProductShowcase";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/config/site";
import { localizeMetadata } from "@/lib/seo";

const homeScreens = [
  "buyer:home",
  "business:dashboard",
  "rider:dashboard",
  "desktop:dashboard",
  "desktop:pos",
  "whatsapp:chat",
] as const;

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
        primaryAction={{ href: "/download?app=buyer", label: t("cta") }}
        secondaryAction={{ href: "/business", label: t("secondary") }}
        screenKey="buyer:home"
      />
      <RolesSection />
      <Section className="bg-surface pt-0 sm:pt-0">
        <ProductShowcase screenKeys={homeScreens} priority />
      </Section>
      <HowItWorks />
      <FeaturesSection />
      <PlatformStrip />
      <CitiesSection />
      <RoleDownloadCta audience="all" />
    </>
  );
}
