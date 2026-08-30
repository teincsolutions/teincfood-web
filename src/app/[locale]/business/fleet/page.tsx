import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Users, Route, BarChart3 } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { StepsSection } from "@/components/sections/StepsSection";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { InstallCta } from "@/components/home/InstallCta";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { DeviceFrame } from "@/components/showcase/DeviceFrame";
import { DesktopFrame } from "@/components/showcase/DesktopFrame";
import { storeLinks } from "@/config/site";
import { localizeMetadata } from "@/lib/seo";

const fleetScreens = [
  "fleet:dashboard",
  "fleet:rider-management",
  "fleet:delivery-tracking",
  "fleet:analytics",
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
  const tScreens = await getTranslations({ locale, namespace: "fleet.screens" });
  const tDesktop = await getTranslations({ locale, namespace: "fleet.desktop" });

  return (
    <>
      <Hero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        storeLinks={storeLinks.business}
        screenKey="fleet:dashboard"
      />
      <StepsSection ns="fleet.steps" />
      <FeatureCards
        ns="fleet.features"
        icons={[Users, Route, BarChart3]}
      />

      {/* Fleet Screens — placeholders until real screenshots arrive */}
      <Section className="bg-white">
        <SectionHeading
          eyebrow={tScreens("eyebrow")}
          title={tScreens("title")}
          subtitle={tScreens("subtitle")}
        />
        <div className="mt-10 flex gap-4 overflow-x-auto pb-4 scrollbar-thin sm:gap-6 lg:justify-center">
          {fleetScreens.map((key) => (
            <DeviceFrame key={key} screenKey={key} className="w-56 shrink-0 sm:w-64" />
          ))}
        </div>
      </Section>

      {/* Desktop Fleet Management */}
      <Section className="bg-surface">
        <SectionHeading
          title={tDesktop("title")}
          subtitle={tDesktop("subtitle")}
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <DesktopFrame screenKey="desktop:dashboard" className="w-full" />
        </div>
      </Section>

      <InstallCta />
    </>
  );
}
