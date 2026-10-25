import { useTranslations } from "next-intl";
import { BadgePercent, Headphones, Radar, ShieldCheck } from "lucide-react";
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
      <SectionHeading
        title={t("title")}
        subtitle={t("subtitle")}
        tone="inverse"
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="rounded-xl border border-white/10 bg-white/[0.05] p-6"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-orange/15 text-orange-300">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-bold">{t(`${item.key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {t(`${item.key}.description`)}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
