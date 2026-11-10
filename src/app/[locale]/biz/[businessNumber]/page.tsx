import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { BizLanding } from "@/components/business/BizLanding";
import { BuyerAppHandoff } from "@/components/install/BuyerAppHandoff";
import { localizeMetadata } from "@/lib/seo";
import { apiUrl } from "@/lib/api-base";

async function resolveBusiness(businessNumber: string): Promise<{
  id: string;
  name: string;
  business_number: string;
} | null> {
  try {
    const res = await fetch(
      apiUrl(`/businesses/by-number/${encodeURIComponent(businessNumber)}`),
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const body = (await res.json()) as {
      data?: { id: string; name: string; business_number: string };
    };
    return body.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; businessNumber: string }>;
}): Promise<Metadata> {
  const { locale, businessNumber } = await params;
  const t = await getTranslations({ locale, namespace: "meta.biz" });
  const business = await resolveBusiness(businessNumber);
  return localizeMetadata({
    locale,
    path: `/biz/${businessNumber}`,
    title: business ? `${business.name} — Teinc Food` : t("title"),
    description: t("description"),
  });
}

export default async function BizPage({
  params,
}: {
  params: Promise<{ locale: string; businessNumber: string }>;
}) {
  const { locale, businessNumber } = await params;
  setRequestLocale(locale);

  const business = await resolveBusiness(businessNumber);
  if (!business) notFound();

  return (
    <Section>
      <BuyerAppHandoff
        path={`/biz/${encodeURIComponent(business.business_number)}`}
      />
      <Container className="max-w-2xl">
        <Suspense>
          <BizLanding
            businessName={business.name}
            businessNumber={business.business_number}
          />
        </Suspense>
      </Container>
    </Section>
  );
}
