import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CreditCard,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { PageHeader } from "@/components/sections/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { localizeMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import {
  FLEET_FEATURE_ROWS,
  FLEET_PLANS,
  MERCHANT_FEATURE_ROWS,
  MERCHANT_PLANS,
  PLAN_CONFIG,
  PLAN_VALUES,
  formatGhs,
  type FeatureValue,
  type PlanKey,
} from "@/config/plans";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.plans" });
  return localizeMetadata({
    locale,
    path: "/plans",
    title: t("title"),
    description: t("description"),
  });
}

function FeatureCell({
  value,
  includedLabel,
  notIncludedLabel,
  percent = false,
}: {
  value: FeatureValue;
  includedLabel: string;
  notIncludedLabel: string;
  percent?: boolean;
}) {
  if (typeof value === "number") {
    return (
      <span className="font-bold text-navy">
        {percent ? `${value}%` : value}
      </span>
    );
  }

  return value ? (
    <>
      <Check className="mx-auto size-5 text-orange-800" aria-hidden="true" />
      <span className="sr-only">{includedLabel}</span>
    </>
  ) : (
    <>
      <X className="mx-auto size-5 text-navy/25" aria-hidden="true" />
      <span className="sr-only">{notIncludedLabel}</span>
    </>
  );
}

export default async function PlansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "plans" });
  const includedLabel = t("compare.included");
  const notIncludedLabel = t("compare.notIncluded");

  const renderPlanCard = (key: PlanKey) => {
    const plan = PLAN_CONFIG[key];
    const isFree = plan.monthlyFeeMinor === 0 && plan.yearlyFeeMinor === 0;
    const features = t.raw(`cards.${key}.features`) as string[];

    return (
      <article
        key={key}
        className={cn(
          "relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm",
          plan.popular
            ? "border-orange-800 ring-1 ring-orange-800/20"
            : "border-navy/10",
        )}
      >
        {plan.popular ? (
          <span className="absolute -top-3 left-6 rounded-full bg-orange-800 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
            {t("billing.popular")}
          </span>
        ) : null}

        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-xl font-extrabold text-navy">
            {t(`cards.${key}.name`)}
          </h3>
          {plan.trialDays > 0 ? (
            <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-800">
              {t("billing.trial", { days: plan.trialDays })}
            </span>
          ) : null}
        </div>

        <p className="mt-2 min-h-10 text-sm leading-relaxed text-navy/65">
          {t(`cards.${key}.tagline`)}
        </p>

        <div className="mt-5">
          {isFree ? (
            <>
              <p className="text-3xl font-extrabold tracking-tight text-navy">
                {t("billing.free")}
              </p>
              <p className="mt-1 text-sm text-navy/55">
                {t("billing.noMonthly")}
              </p>
            </>
          ) : (
            <>
              <p className="text-3xl font-extrabold tracking-tight text-navy">
                {formatGhs(plan.monthlyFeeMinor)}
                <span className="text-sm font-semibold text-navy/55">
                  {t("billing.perMonth")}
                </span>
              </p>
              <p className="mt-1 text-sm text-navy/55">
                {formatGhs(plan.yearlyFeeMinor)}
                {t("billing.perYear")} · {t("billing.yearlySave")}
              </p>
            </>
          )}
        </div>

        <p className="mt-3 rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-navy/70">
          {t("billing.commission", { rate: plan.commissionPercent })}
        </p>

        <ul className="mt-5 flex-1 space-y-2.5 text-sm text-navy/75">
          {features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <Check
                className="mt-0.5 size-4 shrink-0 text-orange-800"
                aria-hidden="true"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <ButtonLink
          href="/download?app=business"
          variant={plan.popular ? "primary" : "outline"}
          className="mt-6 w-full"
        >
          {t("downloadCta")}
        </ButtonLink>
      </article>
    );
  };

  const renderComparison = (
    plans: PlanKey[],
    rows: readonly string[],
    title: string,
  ) => (
    <div>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-navy/45">
        {title}
      </h3>
      <div className="overflow-x-auto rounded-2xl border border-navy/10 bg-white">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 bg-surface">
              <th scope="col" className="px-4 py-3 font-bold text-navy">
                {t("compare.feature")}
              </th>
              {plans.map((key) => (
                <th
                  key={key}
                  scope="col"
                  className="px-4 py-3 text-center font-bold text-navy"
                >
                  {t(`cards.${key}.name`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-navy/5">
              <th scope="row" className="px-4 py-3 font-semibold text-navy/75">
                {t("compare.monthlyFee")}
              </th>
              {plans.map((key) => (
                <td key={key} className="px-4 py-3 text-center font-bold text-navy">
                  {formatGhs(PLAN_CONFIG[key].monthlyFeeMinor)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-navy/5">
              <th scope="row" className="px-4 py-3 font-semibold text-navy/75">
                {t("compare.yearlyFee")}
              </th>
              {plans.map((key) => (
                <td key={key} className="px-4 py-3 text-center font-bold text-navy">
                  {formatGhs(PLAN_CONFIG[key].yearlyFeeMinor)}
                </td>
              ))}
            </tr>
            {rows.map((rowKey) => (
              <tr key={rowKey} className="border-b border-navy/5 last:border-0">
                <th scope="row" className="px-4 py-3 font-semibold text-navy/75">
                  {t(`compare.rows.${rowKey}`)}
                </th>
                {plans.map((key) => (
                  <td key={key} className="px-4 py-3 text-center">
                    <FeatureCell
                      value={PLAN_VALUES[key][rowKey]}
                      includedLabel={includedLabel}
                      notIncludedLabel={notIncludedLabel}
                      percent={rowKey === "commission"}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4].map((index) => ({
      "@type": "Question",
      name: t(`faq.q${index}`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`faq.a${index}`),
      },
    })),
  };

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        actions={
          <>
            <ButtonLink href="/download?app=business">
              {t("downloadCta")}
            </ButtonLink>
            <ButtonLink href="#compare" variant="outline">
              {t("compare.compareCta")}
            </ButtonLink>
          </>
        }
      />

      <Section className="bg-white">
        <SectionHeading
          title={t("merchant.title")}
          subtitle={t("merchant.intro")}
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {MERCHANT_PLANS.map(renderPlanCard)}
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading
          title={t("fleet.title")}
          subtitle={t("fleet.intro")}
        />
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-navy/60">
          {t("fleet.note")}
        </p>
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          {FLEET_PLANS.map(renderPlanCard)}
        </div>
      </Section>

      <Section id="compare" className="bg-white">
        <SectionHeading
          title={t("compare.title")}
          subtitle={t("compare.intro")}
        />
        <div className="mt-10 space-y-8">
          {renderComparison(
            MERCHANT_PLANS,
            MERCHANT_FEATURE_ROWS,
            t("compare.merchantTitle"),
          )}
          {renderComparison(
            FLEET_PLANS,
            FLEET_FEATURE_ROWS,
            t("compare.fleetTitle"),
          )}
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading
          title={t("how.title")}
          subtitle={t("how.intro")}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: CreditCard,
              title: t("how.step1Title"),
              body: t("how.step1Body"),
            },
            {
              icon: Sparkles,
              title: t("how.step2Title"),
              body: t("how.step2Body"),
            },
            {
              icon: RefreshCw,
              title: t("how.step3Title"),
              body: t("how.step3Body"),
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-navy/10 bg-white p-6"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-orange-100 text-orange-800">
                <item.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-extrabold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <SectionHeading
          title={t("faq.title")}
          subtitle={t("faq.intro")}
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          <JsonLd data={faqJson} />
          {[1, 2, 3, 4].map((index) => (
            <details
              key={index}
              className="group rounded-xl border border-navy/10 bg-white p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-navy">
                {t(`faq.q${index}`)}
                <ChevronDown
                  className="size-5 shrink-0 text-navy/50 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-navy/70">
                {t(`faq.a${index}`)}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <Section className="bg-navy">
        <div className="rounded-3xl bg-navy-deep px-6 py-12 text-center sm:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
            {t("eyebrow")}
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            {t("cta.body")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/download?app=business" variant="inverse">
              {t("downloadCta")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href="/contact"
              variant="outline"
              className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              {t("contactCta")}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
