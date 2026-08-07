import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Apple, Play } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { storeLinks } from "@/config/site";

export function InstallCta() {
  const t = useTranslations("home.cta");

  return (
    <Section className="py-16 sm:py-20">
      <Container>
        <div
          id="install"
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-navy to-navyDeep p-10 text-center text-white sm:p-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-orange/20 blur-3xl"
          />
          <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/70">
            {t("subtitle")}
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            {storeLinks.buyer.appStore && (
              <StoreLink
                href={storeLinks.buyer.appStore}
                icon={<Apple className="size-6" aria-hidden="true" />}
                top="Download on the"
                label="App Store"
              />
            )}
            {storeLinks.buyer.playStore && (
              <StoreLink
                href={storeLinks.buyer.playStore}
                icon={<Play className="size-6 fill-current" aria-hidden="true" />}
                top="Get it on"
                label="Google Play"
              />
            )}
            {!storeLinks.buyer.appStore && !storeLinks.buyer.playStore && (
              <Link
                href="/order"
                className="inline-flex items-center gap-2 rounded-xl bg-orange px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-orange-700"
              >
                {t("button")}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function StoreLink({
  href,
  icon,
  top,
  label,
}: {
  href: string;
  icon: ReactNode;
  top: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[56px] items-center gap-3 rounded-xl bg-white px-6 py-3 text-navy transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
    >
      {icon}
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] uppercase tracking-wide opacity-70">{top}</span>
        <span className="font-bold">{label}</span>
      </span>
    </a>
  );
}