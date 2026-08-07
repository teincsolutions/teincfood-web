import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight, Utensils, Store, Bike } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";

export function RolesSection() {
  const t = useTranslations("home.roles");

  const roles = [
    {
      key: "buyer",
      href: "/order",
      icon: Utensils,
      accent: "bg-orange/10 text-orange-700",
      arrow: "hover:bg-orange",
    },
    {
      key: "business",
      href: "/business",
      icon: Store,
      accent: "bg-navy/10 text-navy",
      arrow: "hover:bg-navy",
    },
    {
      key: "rider",
      href: "/rider",
      icon: Bike,
      accent: "bg-orange/10 text-orange-700",
      arrow: "hover:bg-navy",
    },
  ] as const;

  return (
    <Section className="bg-surface">
      <SectionHeading title={t("title")} />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Link
              key={role.key}
              href={role.href}
              className="group flex flex-col rounded-3xl border border-navy/5 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              <span
                className={`inline-flex size-14 items-center justify-center rounded-2xl ${role.accent}`}
              >
                <Icon className="size-7" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-xl font-extrabold text-navy">
                {t(`${role.key}.title`)}
              </h3>
              <p className="mt-2 flex-1 leading-relaxed text-navy/70">
                {t(`${role.key}.description`)}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-orange-700">
                {t(`${role.key}.title`)}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}