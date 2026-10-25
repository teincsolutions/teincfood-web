import { ArrowRight, Download, MonitorSmartphone, Store } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Audience = "buyer" | "business" | "desktop" | "all";

export function RoleDownloadCta({
  audience = "all",
  title,
  description,
}: {
  audience?: Audience;
  title?: string;
  description?: string;
}) {
  const t = useTranslations("downloadCta");
  const audiences: Exclude<Audience, "all" | "desktop">[] =
    audience === "all" ? ["buyer", "business"] : [];

  const cards =
    audience === "desktop"
      ? [
          {
            key: "desktop",
            href: "/download?app=desktop",
            icon: MonitorSmartphone,
            title: t("audiences.desktop.title"),
            body: t("audiences.desktop.body"),
          },
        ]
      : audience === "all"
        ? audiences.map((key) => ({
            key,
            href: `/download?app=${key}`,
            icon: key === "buyer" ? Store : Download,
            title: t(`audiences.${key}.title`),
            body: t(`audiences.${key}.body`),
          }))
        : [
            {
              key: audience,
              href: `/download?app=${audience}`,
              icon: audience === "buyer" ? Store : Download,
              title: t(`audiences.${audience}.title`),
              body: t(`audiences.${audience}.body`),
            },
          ];

  return (
    <Section className="bg-white">
      <div className="overflow-hidden rounded-2xl bg-navy px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              {title ?? t("title")}
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-white/70">
              {description ?? t("subtitle")}
            </p>
          </div>

          <div
            className={cn(
              "grid gap-3",
              cards.length > 1 ? "sm:grid-cols-2" : "sm:grid-cols-1",
            )}
          >
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.key}
                  className="flex flex-col rounded-xl border border-white/10 bg-white/[0.06] p-5"
                >
                  <Icon
                    aria-hidden="true"
                    className="size-5 text-orange-300"
                  />
                  <h3 className="mt-3 font-bold">{card.title}</h3>
                  <p className="mt-1 flex-1 text-sm leading-relaxed text-white/60">
                    {card.body}
                  </p>
                  <div className="mt-5 hidden sm:block">
                    <ButtonLink
                      href={card.href}
                      variant="inverse"
                      size="sm"
                      className="w-full"
                    >
                      {t("download")}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </ButtonLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
