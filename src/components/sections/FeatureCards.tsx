import type { ComponentType } from "react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

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
      <div
        className={cn(
          "mt-10 grid gap-4",
          icons.length === 4
            ? "sm:grid-cols-2 lg:grid-cols-4"
            : "md:grid-cols-3",
        )}
      >
        {icons.map((Icon, index) => (
          <div
            key={index}
            className="rounded-xl border border-navy/10 bg-white p-6"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-navy text-white">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-navy">
              {t(`item${index + 1}.title`)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-navy/70">
              {t(`item${index + 1}.description`)}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
