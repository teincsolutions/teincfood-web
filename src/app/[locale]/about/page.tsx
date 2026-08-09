import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
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

  const t = await import("next-intl/server").then((m) =>
    m.getTranslations({ locale, namespace: "meta.about" })
  );
  return localizeMetadata({
    locale,
    path: "/about",
    title: (await t)("title"),
    description: (await t)("description"),
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

  if (page) {
    return (
      <Section>
        <Container className="max-w-3xl">
          <SectionHeading align="left" title={page.title} />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-navy/75">
            {page.sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-xl font-extrabold text-navy">{s.heading}</h2>
                <p className="mt-2">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    );
  }

  const { getTranslations } = await import("next-intl/server");
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <Section>
      <Container className="max-w-3xl">
        <SectionHeading align="left" title={t("title")} />
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-navy/75">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
        </div>
      </Container>
    </Section>
  );
}
