import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

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
      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <li
            key={i}
            className={cn(
              "rounded-xl border border-navy/10 bg-surface p-6",
              i === 2 && "md:mt-6",
            )}
          >
            <span className="text-sm font-bold tabular-nums tracking-[0.14em] text-orange-800">
              0{i}
            </span>
            <h3 className="mt-4 text-lg font-bold text-navy">
              {withDescriptions ? t(`step${i}.title`) : t(`step${i}`)}
            </h3>
            {withDescriptions && (
              <p className="mt-2 text-sm leading-relaxed text-navy/70">
                {t(`step${i}.description`)}
              </p>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
