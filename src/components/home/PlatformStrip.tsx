import { ArrowRight, MessageCircle, Monitor } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";

export function PlatformStrip() {
  const t = useTranslations("home.platformStrip");

  const items = [
    {
      href: "/whatsapp",
      icon: MessageCircle,
      title: t("whatsapp.title"),
      body: t("whatsapp.body"),
      cta: t("whatsapp.cta"),
    },
    {
      href: "/desktop",
      icon: Monitor,
      title: t("desktop.title"),
      body: t("desktop.body"),
      cta: t("desktop.cta"),
    },
  ];

  return (
    <Section className="bg-white">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col rounded-xl border border-navy/10 bg-white p-6 transition-colors hover:border-orange/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-navy/[0.06] text-navy">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-navy">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/70">
                {item.body}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-orange-800">
                {item.cta}
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
