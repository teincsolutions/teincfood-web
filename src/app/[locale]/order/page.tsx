import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CreditCard, Radar, Store } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { StepsSection } from "@/components/sections/StepsSection";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { RoleDownloadCta } from "@/components/home/RoleDownloadCta";
import { BuyerAppHandoff } from "@/components/install/BuyerAppHandoff";
import { ProductShowcase } from "@/components/showcase/ProductShowcase";
import { Section } from "@/components/ui/Section";
import { localizeMetadata } from "@/lib/seo";

const buyerScreens = [
  "buyer:home",
  "buyer:restaurant",
  "buyer:cart",
  "buyer:checkout",
  "buyer:tracking",
  "buyer:orders",
  "buyer:help",
] as const;

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
  const tWhatsapp = await getTranslations({
    locale,
    namespace: "order.whatsapp",
  });

  return (
    <>
      <BuyerAppHandoff path="/order" />
      <Hero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        primaryAction={{
          href: "/download?app=buyer",
          label: t("cta"),
        }}
        secondaryAction={{ href: "/whatsapp", label: tWhatsapp("cta") }}
        screenKey="buyer:home"
      />
      <StepsSection ns="order.steps" withDescriptions={false} />
      <FeatureCards ns="order.features" icons={[Store, Radar, CreditCard]} />
      <Section className="bg-surface">
        <ProductShowcase screenKeys={buyerScreens} />
      </Section>
      <RoleDownloadCta audience="buyer" />
    </>
  );
}
