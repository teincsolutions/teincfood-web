import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Store, Radar, CreditCard, MessageCircle } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { StepsSection } from "@/components/sections/StepsSection";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { InstallCta } from "@/components/home/InstallCta";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/routing";
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
  const tWhatsapp = await getTranslations({ locale, namespace: "order.whatsapp" });

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

      {/* Order via WhatsApp */}
      <Section className="bg-white">
        <Container>
          <SectionHeading
            title={tWhatsapp("title")}
            subtitle={tWhatsapp("subtitle")}
          />
          <div className="mt-8 flex justify-center">
            <Link
              href="/whatsapp"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[#128C7E]"
            >
              <MessageCircle className="size-5" />
              {tWhatsapp("cta")}
            </Link>
          </div>
        </Container>
      </Section>

      <InstallCta />
    </>
  );
}