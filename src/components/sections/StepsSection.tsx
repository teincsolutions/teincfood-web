import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "./SectionHeading";

export function StepsSection({
  ns,
  withDescriptions = true,
}: {
  ns: string;
  withDescriptions?: boolean;
}) {
  const t = useTranslations(ns);

  return (
    <Section>
      <SectionHeading title={t("title")} />
      <ol className="mt-12 grid gap-8 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <li
            key={i}
            className="relative rounded-3xl border border-navy/5 bg-surface p-8"
          >
            <span className="text-5xl font-extrabold text-orange/30">
              {String(i).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-xl font-extrabold text-navy">
              {withDescriptions ? t(`step${i}.title`) : t(`step${i}`)}
            </h3>
            {withDescriptions && (
              <p className="mt-2 leading-relaxed text-navy/70">
                {t(`step${i}.description`)}
              </p>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}