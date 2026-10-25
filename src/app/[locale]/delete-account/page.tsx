import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Clock3, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { DeleteAccountFlow } from "@/components/delete-account/DeleteAccountFlow";
import { localizeMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.deleteAccount" });
  return localizeMetadata({
    locale,
    path: "/delete-account",
    title: t("title"),
    description: t("description"),
  });
}

export default async function DeleteAccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "deleteAccount" });

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />

      <Section
        className="bg-surface-muted/40"
        containerClassName="max-w-5xl"
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_32rem] lg:items-start lg:gap-12">
          <div className="mx-auto w-full max-w-lg lg:order-2 lg:mx-0 lg:justify-self-end">
            <DeleteAccountFlow />
          </div>

          <aside className="space-y-4 lg:order-1 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-orange-800/10 text-orange-800">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </span>
                <h2 className="font-bold text-navy">{t("aside.title")}</h2>
              </div>

              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-navy/70">
                <li className="flex gap-3">
                  <Clock3
                    className="mt-0.5 size-4 shrink-0 text-orange-800"
                    aria-hidden="true"
                  />
                  <span>{t("aside.deactivate")}</span>
                </li>
                <li className="flex gap-3">
                  <Trash2
                    className="mt-0.5 size-4 shrink-0 text-orange-800"
                    aria-hidden="true"
                  />
                  <span>{t("aside.data")}</span>
                </li>
                <li className="flex gap-3">
                  <RefreshCw
                    className="mt-0.5 size-4 shrink-0 text-orange-800"
                    aria-hidden="true"
                  />
                  <span>{t("aside.restore")}</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <p className="text-sm font-semibold text-navy">
                {t("aside.help")}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-navy/60">
                {t("aside.helpBody")}
              </p>
              <ButtonLink
                href="/contact"
                variant="outline"
                size="sm"
                className="mt-4 w-full sm:w-auto"
              >
                {t("aside.contact")}
              </ButtonLink>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
