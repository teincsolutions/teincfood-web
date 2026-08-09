import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/sections/SectionHeading";
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
  const title = page?.title ?? "Help & FAQ";
  const description = page?.meta_description ?? "Find answers to common questions.";

  return localizeMetadata({
    locale,
    path: "/faq",
    title,
    description,
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

  if (page) {
    const faqSections = page.sections.filter((s) => s.type === "faq");
    const grouped = faqSections.reduce<Record<string, ContentSection[]>>(
      (acc, s) => {
        const cat = s.category ?? "General";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(s);
        return acc;
      },
      {}
    );
    const categories = Object.keys(grouped);
    const faqJson = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqSections.map((faq) => ({
        "@type": "Question",
        name: faq.heading,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.body,
        },
      })),
    };

    return (
      <Section>
        <Container className="max-w-3xl">
          <SectionHeading
            title={page.title}
            subtitle={page.meta_description ?? undefined}
          />
          <JsonLd data={faqJson} />
          <div className="mt-12 space-y-4">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy/50">
                  {category}
                </h3>
                <div className="space-y-4">
                  {grouped[category]
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((faq, i) => (
                      <details
                        key={i}
                        className="group rounded-2xl border border-navy/5 bg-surface p-6"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-navy [&::-webkit-details-marker]:hidden">
                          {faq.heading}
                          <span
                            aria-hidden="true"
                            className="text-2xl text-orange-700 transition-transform group-open:rotate-45"
                          >
                            +
                          </span>
                        </summary>
                        <p className="mt-3 leading-relaxed text-navy/70">
                          {faq.body}
                        </p>
                      </details>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  const { getTranslations } = await import("next-intl/server");
  const t = await getTranslations({ locale, namespace: "faq" });

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
  ];

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <Section>
      <Container className="max-w-3xl">
        <SectionHeading title={t("title")} subtitle={t("intro")} />
        <JsonLd data={faqJson} />
        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-navy/5 bg-surface p-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-navy [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span
                  aria-hidden="true"
                  className="text-2xl text-orange-700 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-navy/70">{faq.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
