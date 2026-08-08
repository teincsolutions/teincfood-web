import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { localizeMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.resetPassword" });
  return localizeMetadata({
    locale,
    path: "/reset-password",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "resetPassword" });

  return (
    <Section>
      <Container className="max-w-2xl">
        <SectionHeading title={t("title")} subtitle={t("intro")} />
        <div className="mt-12">
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </Container>
    </Section>
  );
}