import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { localizeMetadata } from "@/lib/seo";
import { getPage } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const page = await getPage("about", locale);
  if (page) {
    return localizeMetadata({
      locale,
      path: "/about",
      title: page.title,
      description: page.meta_description ?? "",
    });
  }

  const t = await getTranslations({ locale, namespace: "meta.about" });
  return localizeMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await getPage("about", locale);
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={page?.title ?? t("title")}
        intro={page?.meta_description ?? t("p1")}
      />
      <Section>
        <Container className="max-w-3xl">
          <div className="space-y-10">
            {(page?.sections ?? [
              { heading: t("title"), body: t("p1") },
              { heading: t("eyebrow"), body: t("p2") },
            ]).map((section, index) => (
              <article key={index}>
                <h2 className="text-xl font-extrabold text-navy">
                  {section.heading}
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-navy/75">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
