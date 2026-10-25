import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight, Bike, Store, Utensils } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";

const roles = [
  {
    key: "buyer",
    href: "/order",
    icon: Utensils,
  },
  {
    key: "business",
    href: "/business",
    icon: Store,
  },
  {
    key: "rider",
    href: "/rider",
    icon: Bike,
  },
] as const;

export function RolesSection() {
  const t = useTranslations("home.roles");

  return (
    <Section className="bg-white">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {roles.map((role, index) => {
          const Icon = role.icon;
          return (
            <Link
              key={role.key}
              href={role.href}
              className="group flex flex-col rounded-xl border border-navy/10 bg-white p-6 transition-colors hover:border-orange/40 hover:bg-surface/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-orange/10 text-orange-800">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="text-xs font-bold tracking-[0.14em] text-navy/35">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-navy">
                {t(`${role.key}.title`)}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/70">
                {t(`${role.key}.description`)}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-orange-800">
                {t(`${role.key}.cta`)}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
