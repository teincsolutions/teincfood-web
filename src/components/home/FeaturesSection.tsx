import { useTranslations } from "next-intl";
import { Radar, ShieldCheck, Headphones, BadgePercent } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";

export function FeaturesSection() {
  const t = useTranslations("home.features");

  const items = [
    { key: "item1", icon: Radar },
    { key: "item2", icon: ShieldCheck },
    { key: "item3", icon: Headphones },
    { key: "item4", icon: BadgePercent },
  ];

  return (
    <Section className="bg-navy text-white">
      <SectionHeading title={t("title")} />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="rounded-3xl border border-white/10 bg-white/5 p-7"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-orange text-white">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-extrabold">
                {t(`${item.key}.title`)}
              </h3>
              <p className="mt-2 leading-relaxed text-white/60">
                {t(`${item.key}.description`)}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}