import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { Section } from "@/components/ui/Section";
import { AppsShowcase } from "@/components/showcase/AppsShowcase";
import { AppsDownloadSection } from "@/components/download/AppsDownloadSection";
import { localizeMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.apps" });

  return localizeMetadata({
    locale,
    path: "/apps",
    title: t("title"),
    description: t("description"),
    images: ["/icon.png"],
  });
}

export default async function AppsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "showcase.controls" });

  return (
    <>
      <PageHeader eyebrow={t("title")} title={t("title")} intro={t("subtitle")} />
      <Section className="bg-white">
        <AppsShowcase />
      </Section>
      <AppsDownloadSection />
    </>
  );
}
