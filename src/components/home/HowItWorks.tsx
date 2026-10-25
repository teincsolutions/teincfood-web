import { useTranslations } from "next-intl";
import { Download, MapPin, Search } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { cn } from "@/lib/utils";

export function HowItWorks() {
  const t = useTranslations("home.how");

  const steps = [
    { key: "step1", icon: Download },
    { key: "step2", icon: Search },
    { key: "step3", icon: MapPin },
  ];

  return (
    <Section className="bg-surface">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.key}
              className={cn(
                "rounded-xl border border-navy/10 bg-white p-6",
                index === 1 && "md:mt-6",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-navy text-white">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-orange-800">
                  {t("stepLabel", { number: index + 1 })}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-navy">
                {t(`${step.key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/70">
                {t(`${step.key}.description`)}
              </p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
