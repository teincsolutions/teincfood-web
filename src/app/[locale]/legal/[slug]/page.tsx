import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/sections/PageHeader";
import { Link } from "@/i18n/routing";
import { localizeMetadata } from "@/lib/seo";
import { getPage } from "@/lib/content";

const legalPages = ["privacy", "terms"] as const;

function formatUpdatedAt(value: string | undefined, locale: string): string {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!(legalPages as readonly string[]).includes(slug)) return {};

  const page = await getPage(slug, locale);
  if (page) {
    return localizeMetadata({
      locale,
      path: `/legal/${slug}`,
      title: page.title,
      description: page.meta_description ?? "",
    });
  }

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

  const page = await getPage(slug, locale);
  const legal = await getTranslations({ locale, namespace: "legal" });
  const ns = slug === "privacy" ? "legal.privacy" : "legal.terms";
  const t = await getTranslations({ locale, namespace: ns });

  const title = page?.title ?? t("title");
  const intro = page?.meta_description ?? undefined;
  const updatedAt =
    formatUpdatedAt(page?.updated_at, locale) || legal("effectiveDate");
  const sections = page
    ? page.sections.map((section) => ({
        title: section.heading,
        body: section.body,
      }))
    : [1, 2, 3].map((index) => ({
        title: t(`section${index}`),
        body: t(`p${index}`),
      }));

  return (
    <>
      <PageHeader
        eyebrow={legal("eyebrow")}
        title={title}
        intro={intro}
        align="left"
      />
      <Section>
        <Container className="max-w-3xl">
          <p className="text-sm text-navy/55">
            {legal("updated")}: {updatedAt}
          </p>
          <div className="mt-8 space-y-9">
            {sections.map((section, index) => (
              <article key={index}>
                <h2 className="text-xl font-extrabold text-navy">
                  {section.title}
                </h2>
                <p className="mt-3 leading-relaxed text-navy/75">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-12 rounded-xl border border-navy/10 bg-surface p-5 text-sm text-navy/70">
            {legal("contactPrompt")}{" "}
            <Link
              href="/contact"
              className="font-semibold text-orange-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
            >
              {legal("contactUs")}
            </Link>
          </p>
        </Container>
      </Section>
    </>
  );
}
