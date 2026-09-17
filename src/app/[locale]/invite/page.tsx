import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { InviteLanding } from "@/components/auth/InviteLanding";
import { localizeMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.invite" });
  return localizeMetadata({
    locale,
    path: "/invite",
    title: t("title"),
    description: t("description"),
  });
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Section>
      <Container className="max-w-2xl">
        <Suspense>
          <InviteLanding />
        </Suspense>
      </Container>
    </Section>
  );
}
