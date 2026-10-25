import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BarChart3, Route, Users } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { StepsSection } from "@/components/sections/StepsSection";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { RoleDownloadCta } from "@/components/home/RoleDownloadCta";
import { ProductShowcase } from "@/components/showcase/ProductShowcase";
import { Section } from "@/components/ui/Section";
import { localizeMetadata } from "@/lib/seo";

const fleetScreens = [
  "fleet:dashboard",
  "fleet:rider-management",
  "fleet:delivery-tracking",
  "fleet:analytics",
  "desktop:dashboard",
  "desktop:delivery",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.fleet" });
  return localizeMetadata({
    locale,
    path: "/business/fleet",
    title: t("title"),
    description: t("description"),
    images: ["/icon.png"],
  });
}

export default async function FleetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "fleet.hero" });

  return (
    <>
      <Hero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        primaryAction={{ href: "/download?app=business", label: t("cta") }}
        secondaryAction={{ href: "/contact", label: t("secondary") }}
        screenKey="fleet:dashboard"
      />
      <StepsSection ns="fleet.steps" />
      <FeatureCards ns="fleet.features" icons={[Users, Route, BarChart3]} />
      <Section className="bg-white">
        <ProductShowcase screenKeys={fleetScreens} />
      </Section>
      <RoleDownloadCta audience="business" />
    </>
  );
}
