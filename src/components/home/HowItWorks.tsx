import { useTranslations } from "next-intl";
import { Download, Search, MapPin } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";

export function HowItWorks() {
  const t = useTranslations("home.how");

  const steps = [
    { key: "step1", icon: Download },
    { key: "step2", icon: Search },
    { key: "step3", icon: MapPin },
  ];

  return (
    <Section>
      <SectionHeading title={t("title")} />
      <ol className="mt-12 grid gap-10 md:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <li key={step.key} className="relative text-center md:text-left">
              <span className="absolute left-1/2 top-6 h-px w-full -translate-y-1/2 bg-navy/10 max-md:hidden" />
              <div className="relative mx-auto flex size-12 items-center justify-center rounded-full bg-navy text-white md:mx-0">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-orange-700">
                Step {i + 1}
              </p>
              <h3 className="mt-1 text-xl font-extrabold text-navy">
                {t(`${step.key}.title`)}
              </h3>
              <p className="mt-2 leading-relaxed text-navy/70">
                {t(`${step.key}.description`)}
              </p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}