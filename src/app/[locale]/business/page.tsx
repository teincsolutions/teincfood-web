import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ClipboardList, TrendingUp, Truck, Monitor, ArrowRight } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { StepsSection } from "@/components/sections/StepsSection";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { InstallCta } from "@/components/home/InstallCta";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { DesktopFrame } from "@/components/showcase/DesktopFrame";
import { DeviceFrame } from "@/components/showcase/DeviceFrame";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/routing";
import { storeLinks } from "@/config/site";
import { localizeMetadata } from "@/lib/seo";

const sellerScreens = [
  "business:dashboard",
  "business:orders",
  "business:analytics",
  "business:menus",
  "business:pos-checkout",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.business" });
  return localizeMetadata({
    locale,
    path: "/business",
    title: t("title"),
    description: t("description"),
    images: ["/icon.png"],
  });
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "business.hero" });
  const tScreens = await getTranslations({ locale, namespace: "business.screens" });
  const tDesktop = await getTranslations({ locale, namespace: "business.desktop" });

  return (
    <>
      <Hero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        storeLinks={storeLinks.business}
        screenKey="business:dashboard"
      />
      <StepsSection ns="business.steps" />
      <FeatureCards
        ns="business.features"
        icons={[ClipboardList, TrendingUp, Truck]}
      />

      {/* Mobile Screenshots Showcase */}
      <Section className="bg-white">
        <SectionHeading
          eyebrow={tScreens("eyebrow")}
          title={tScreens("title")}
        />
        <div className="mt-10 flex gap-4 overflow-x-auto pb-4 scrollbar-thin sm:gap-6 lg:justify-center">
          {sellerScreens.map((key) => (
            <DeviceFrame key={key} screenKey={key} className="w-56 shrink-0 sm:w-64" />
          ))}
        </div>
      </Section>

      {/* Desktop App Section */}
      <Section className="bg-surface">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <DesktopFrame screenKey="desktop:dashboard" priority className="w-full" />
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeading
                title={tDesktop("title")}
                subtitle={tDesktop("subtitle")}
                align="left"
              />
              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
                    <Monitor className="size-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-navy">{tDesktop("feature1.title")}</h3>
                    <p className="text-sm text-navy/60">{tDesktop("feature1.description")}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/desktop"
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
                >
                  <Monitor className="size-4" />
                  {tDesktop("cta")}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Fleet Managers CTA */}
      <Section className="bg-white">
        <Container>
          <div className="rounded-3xl bg-navy px-8 py-10 text-center sm:px-12 sm:py-12">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">For fleet managers</p>
            <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
              Manage a delivery fleet?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              The same Teinc Food Business app — with tools to assign orders, track riders, and optimize every delivery.
            </p>
            <Link
              href="/business/fleet"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
            >
              Explore Fleet Management
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Container>
      </Section>

      <InstallCta />
    </>
  );
}
