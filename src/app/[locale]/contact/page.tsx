import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Smartphone } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/sections/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { localizeMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.contact" });
  return localizeMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const purchase = await getTranslations({
    locale,
    namespace: "downloadCta",
  });

  return (
    <>
      <PageHeader title={t("title")} intro={t("intro")} />
      <Section>
        <Container className="grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border border-navy/10 bg-white p-6 sm:p-8">
            <ContactForm />
          </div>
          <aside className="space-y-4">
            <div className="rounded-xl bg-surface p-6">
              <Mail aria-hidden="true" className="size-5 text-orange-800" />
              <h2 className="mt-3 font-bold text-navy">{t("supportTitle")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy/70">
                {t("supportBody")}
              </p>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-orange-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
              >
                {siteConfig.contactEmail}
              </a>
            </div>
            <div className="rounded-xl bg-navy p-6 text-white">
              <Smartphone aria-hidden="true" className="size-5 text-orange-300" />
              <h2 className="mt-3 font-bold">{purchase("title")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {purchase("subtitle")}
              </p>
              <ButtonLink
                href="/download"
                variant="inverse"
                size="sm"
                className="mt-4 w-full"
              >
                {purchase("download")}
              </ButtonLink>
            </div>
          </aside>
        </Container>
      </Section>
    </>
  );
}
