import type { ComponentType } from "react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "./SectionHeading";

export function FeatureCards({
  ns,
  icons,
}: {
  ns: string;
  icons: ComponentType<{ className?: string }>[];
}) {
  const t = useTranslations(ns);

  return (
    <Section className="bg-surface">
      <SectionHeading title={t("title")} />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {icons.map((Icon, i) => (
          <div
            key={i}
            className="rounded-3xl border border-navy/5 bg-white p-8 shadow-sm"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-navy text-white">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-extrabold text-navy">
              {t(`item${i + 1}.title`)}
            </h3>
            <p className="mt-2 leading-relaxed text-navy/70">
              {t(`item${i + 1}.description`)}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}