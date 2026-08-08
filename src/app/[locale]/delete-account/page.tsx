import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { DeleteAccountFlow } from "@/components/delete-account/DeleteAccountFlow";
import { localizeMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.deleteAccount" });
  return localizeMetadata({
    locale,
    path: "/delete-account",
    title: t("title"),
    description: t("description"),
  });
}

export default async function DeleteAccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "deleteAccount" });

  return (
    <Section>
      <Container className="max-w-2xl">
        <SectionHeading title={t("title")} subtitle={t("intro")} />
        <div className="mt-10">
          <DeleteAccountFlow />
        </div>
      </Container>
    </Section>
  );
}