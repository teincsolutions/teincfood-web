import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClipboardList, Monitor, TrendingUp, Truck } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { StepsSection } from "@/components/sections/StepsSection";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { RoleDownloadCta } from "@/components/home/RoleDownloadCta";
import { ProductShowcase } from "@/components/showcase/ProductShowcase";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { localizeMetadata } from "@/lib/seo";

const sellerScreens = [
  "business:dashboard",
  "business:orders",
  "business:analytics",
  "business:menus",
  "business:pos-checkout",
  "desktop:dashboard",
  "desktop:pos",
  "desktop:kitchen",
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
  const tDesktop = await getTranslations({
    locale,
    namespace: "business.desktop",
  });
  const tFleet = await getTranslations({
    locale,
    namespace: "business.fleetCta",
  });
  const tPlans = await getTranslations({
    locale,
    namespace: "plans",
  });

  return (
    <>
      <Hero
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        primaryAction={{ href: "/download?app=business", label: t("cta") }}
        secondaryAction={{ href: "#screens", label: t("secondary") }}
        screenKey="business:dashboard"
        device="iphone"
      />
      <StepsSection ns="business.steps" />
      <FeatureCards
        ns="business.features"
        icons={[ClipboardList, TrendingUp, Truck]}
      />
      <Section className="bg-surface">
        <div className="flex flex-col gap-6 rounded-2xl border border-navy/10 bg-white p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-800">
              {tPlans("eyebrow")}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              {tPlans("merchant.title")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/65">
              {tPlans("merchant.intro")}
            </p>
          </div>
          <ButtonLink
            href="/plans"
            variant="secondary"
            className="shrink-0"
          >
            {tPlans("compare.compareCta")}
          </ButtonLink>
        </div>
      </Section>
      <Section id="screens" className="bg-white">
        <ProductShowcase screenKeys={sellerScreens} />
      </Section>
      <Section className="bg-surface">
        <div className="grid items-center gap-8 rounded-2xl border border-navy/10 bg-white p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              title={tDesktop("title")}
              subtitle={tDesktop("subtitle")}
              align="left"
            />
            <ButtonLink href="/download?app=desktop" variant="secondary" className="mt-6">
              <Monitor aria-hidden="true" className="size-4" />
              {tDesktop("cta")}
            </ButtonLink>
          </div>
          <div className="rounded-xl bg-navy/[0.03] p-3">
            <ProductShowcase
              screenKeys={["desktop:dashboard", "desktop:pos"]}
              initialDevice="macbook"
              deviceIds={["imac", "hp-monitor", "macbook", "windows-laptop"]}
            />
          </div>
        </div>
      </Section>
      <Section className="bg-white pb-0 sm:pb-0">
        <div className="rounded-2xl bg-navy px-6 py-10 text-white sm:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
                {tFleet("eyebrow")}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                {tFleet("title")}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
                {tFleet("body")}
              </p>
            </div>
            <ButtonLink
              href="/business/fleet"
              variant="inverse"
              className="shrink-0"
            >
              {tFleet("cta")}
            </ButtonLink>
          </div>
        </div>
      </Section>
      <RoleDownloadCta audience="business" />
    </>
  );
}
