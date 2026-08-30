import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CalendarClock, Wallet, Navigation } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { StepsSection } from "@/components/sections/StepsSection";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { InstallCta } from "@/components/home/InstallCta";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { DeviceFrame } from "@/components/showcase/DeviceFrame";
import { storeLinks } from "@/config/site";
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
  const tScreens = await getTranslations({ locale, namespace: "rider.screens" });

  return (
    <>
      <Hero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        storeLinks={storeLinks.business}
        screenKey="rider:dashboard"
        reverse
      />
      <StepsSection ns="rider.steps" />
      <FeatureCards
        ns="rider.features"
        icons={[CalendarClock, Wallet, Navigation]}
      />

      {/* Screenshots Showcase */}
      <Section className="bg-white">
        <SectionHeading
          eyebrow={tScreens("eyebrow")}
          title={tScreens("title")}
        />
        <div className="mt-10 flex gap-4 overflow-x-auto pb-4 scrollbar-thin sm:gap-6 lg:justify-center">
          {riderScreens.map((key) => (
            <DeviceFrame key={key} screenKey={key} className="w-56 shrink-0 sm:w-64" />
          ))}
        </div>
      </Section>

      <InstallCta />
    </>
  );
}
