import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { localizeMetadata } from "@/lib/seo";
import { getPage, type ContentSection } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const page = await getPage("help", locale);
  const meta = await getTranslations({ locale, namespace: "meta.faq" });
  return localizeMetadata({
    locale,
    path: "/faq",
    title: page?.title ?? meta("title"),
    description: page?.meta_description ?? meta("description"),
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await getPage("help", locale);
  const t = await getTranslations({ locale, namespace: "faq" });
  const contact = await getTranslations({ locale, namespace: "contact" });

  const faqSections = page
    ? page.sections.filter((section) => section.type === "faq")
    : [];
  const grouped = faqSections.reduce<Record<string, ContentSection[]>>(
    (acc, section) => {
      const category = section.category ?? "General";
      if (!acc[category]) acc[category] = [];
      acc[category].push(section);
      return acc;
    },
    {},
  );
  const categories = Object.keys(grouped);
  const fallbackFaqs = [1, 2, 3, 4].map((index) => ({
    heading: t(`q${index}`),
    body: t(`a${index}`),
    category: "",
  }));

  const faqs = page ? faqSections : fallbackFaqs;
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.heading,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.body,
      },
    })),
  };

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={page?.title ?? t("title")}
        intro={page?.meta_description ?? t("intro")}
      />
      <Section>
        <Container className="max-w-3xl">
          <JsonLd data={faqJson} />
          {page ? (
            <div className="space-y-10">
              {categories.map((category) => (
                <section key={category}>
                  <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-navy/45">
                    {category}
                  </h2>
                  <div className="space-y-3">
                    {grouped[category]
                      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                      .map((faq, index) => (
                        <FaqItem
                          key={index}
                          question={faq.heading}
                          answer={faq.body}
                        />
                      ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {fallbackFaqs.map((faq, index) => (
                <FaqItem
                  key={index}
                  question={faq.heading}
                  answer={faq.body}
                />
              ))}
            </div>
          )}

          <div className="mt-12 flex flex-col gap-4 rounded-xl border border-navy/10 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-navy">{t("stillNeedHelp")}</h2>
              <p className="mt-1 text-sm text-navy/65">{t("stillNeedHelpBody")}</p>
            </div>
            <ButtonLink href="/contact" variant="secondary">
              {contact("title")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-navy/10 bg-white p-5">
      <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-4 font-bold text-navy [&::-webkit-details-marker]:hidden">
        {question}
        <span
          aria-hidden="true"
          className="shrink-0 text-xl font-normal text-orange-800 transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-navy/70">{answer}</p>
    </details>
  );
}
