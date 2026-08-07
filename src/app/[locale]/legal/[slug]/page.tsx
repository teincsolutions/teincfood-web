import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { localizeMetadata } from "@/lib/seo";

const legalPages = ["privacy", "terms"] as const;

export function generateStaticParams() {
  return legalPages.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!(legalPages as readonly string[]).includes(slug)) return {};
  const ns = slug === "privacy" ? "meta.privacy" : "meta.terms";
  const t = await getTranslations({ locale, namespace: ns });
  return localizeMetadata({
    locale,
    path: `/legal/${slug}`,
    title: t("title"),
    description: t("description"),
  });
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!(legalPages as readonly string[]).includes(slug)) notFound();
  setRequestLocale(locale);

  const ns = slug === "privacy" ? "legal.privacy" : "legal.terms";
  const t = await getTranslations({ locale, namespace: ns });
  const legal = await getTranslations({ locale, namespace: "legal" });

  const sections = [1, 2, 3].map((i) => ({
    title: t(`section${i}`),
    body: t(`p${i}`),
  }));

  return (
    <Section>
      <Container className="max-w-3xl">
        <SectionHeading align="left" title={t("title")} />
        <p className="mt-2 text-sm text-navy/50">
          {legal("updated")}: {new Date().toLocaleDateString(locale)}
        </p>
        <div className="mt-8 space-y-8">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-xl font-extrabold text-navy">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-navy/75">{s.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}