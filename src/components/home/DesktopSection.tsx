import { Monitor, LayoutDashboard, ShoppingCart, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { DesktopFrame } from "@/components/showcase/DesktopFrame";

export function DesktopSection() {
  const t = useTranslations("home.desktop");

  const features = [
    { icon: LayoutDashboard, title: t("item1.title"), description: t("item1.description") },
    { icon: ShoppingCart, title: t("item2.title"), description: t("item2.description") },
    { icon: Users, title: t("item3.title"), description: t("item3.description") },
  ];

  return (
    <Section className="bg-surface">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <DesktopFrame screenKey="desktop:dashboard" priority className="w-full" />
        </div>

        <div className="order-1 lg:order-2">
          <SectionHeading title={t("title")} subtitle={t("subtitle")} align="left" />
          <div className="mt-8 space-y-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                  <feature.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-navy">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy/60">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/desktop"
              className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
            >
              <Monitor className="size-4" />
              {t("cta")}
            </Link>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-navy/5"
            >
              {t("downloads")}
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
