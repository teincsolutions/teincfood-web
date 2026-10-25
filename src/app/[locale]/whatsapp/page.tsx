import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Bot, MapPin, Search, ShoppingBag } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { StepsSection } from "@/components/sections/StepsSection";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { RoleDownloadCta } from "@/components/home/RoleDownloadCta";
import { ProductShowcase } from "@/components/showcase/ProductShowcase";
import { siteConfig } from "@/config/site";
import { localizeMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.whatsapp" });
  return localizeMetadata({
    locale,
    path: "/whatsapp",
    title: t("title"),
    description: t("description"),
    images: ["/icon.png"],
  });
}

export default async function WhatsAppPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "whatsapp.hero" });
  const tSupport = await getTranslations({
    locale,
    namespace: "whatsapp.support",
  });

  return (
    <>
      <Hero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        primaryAction={{
          href: siteConfig.whatsappUrl,
          label: t("cta"),
          external: true,
        }}
        secondaryAction={{ href: "/download?app=buyer", label: t("appCta") }}
        screenKey="whatsapp:chat"
      />

      <FeatureCards
        ns="whatsapp.features"
        icons={[Bot, Search, MapPin, ShoppingBag]}
      />
      <StepsSection ns="whatsapp.steps" />

      <Section className="bg-white">
        <SectionHeading
          eyebrow={tSupport("eyebrow")}
          title={tSupport("title")}
          subtitle={tSupport("subtitle")}
        />
        <div className="mt-10">
          <ProductShowcase
            screenKeys={["whatsapp:chat", "desktop:support"]}
            initialDevice="iphone"
          />
        </div>
      </Section>

      <RoleDownloadCta audience="buyer" />
    </>
  );
}
