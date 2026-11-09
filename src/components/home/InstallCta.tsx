import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { Apple, Play } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { QrCode } from "@/components/install/QrCode";
import { siteConfig, storeLinks } from "@/config/site";

export function InstallCta() {
  const t = useTranslations("install");
  const ct = useTranslations("home.cta");

  const buyer = storeLinks.buyer;
  const business = storeLinks.business;
  const hasAnyLink = Boolean(
    buyer.appStore || buyer.playStore || business.appStore || business.playStore,
  );

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
            {ct("title")}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/70">
            {ct("subtitle")}
          </p>

          {hasAnyLink ? (
            <div className="relative mx-auto mt-10 grid max-w-4xl gap-6 text-left sm:grid-cols-2">
              <DownloadApp
                title={t("forCustomers")}
                appName={t("buyerApp")}
                tagline={t("buyerTagline")}
                iconSrc="/apps/buyer-icon.png"
                appStore={buyer.appStore}
                playStore={buyer.playStore}
                qrUrl={siteConfig.url}
              />
              <DownloadApp
                title={t("forRidersSellers")}
                appName={t("businessApp")}
                tagline={t("businessTagline")}
                iconSrc="/apps/business-icon.png"
                appStore={business.appStore}
                playStore={business.playStore}
                qrUrl={`${siteConfig.url.replace(/\/$/, "")}/business`}
              />
            </div>
          ) : (
            <div className="relative mt-8">
              <Link
                href="/order"
                className="inline-flex items-center gap-2 rounded-xl bg-orange px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-orange-700"
              >
                {ct("button")}
              </Link>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

function DownloadApp({
  title,
  appName,
  tagline,
  iconSrc,
  appStore,
  playStore,
  qrUrl,
}: {
  title: string;
  appName: string;
  tagline: string;
  iconSrc: string;
  appStore?: string;
  playStore?: string;
  qrUrl: string;
}) {
  const t = useTranslations("install");

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-widest text-orange-300">
        {title}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <Image
          src={iconSrc}
          alt={`${appName} icon`}
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-2xl border border-white/15 shadow-lg"
        />
        <div className="min-w-0">
          <p className="text-2xl font-extrabold text-white">{appName}</p>
          <p className="mt-1 text-sm text-white/60">{tagline}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 flex-col gap-2">
          {appStore && (
            <StoreLink
              href={appStore}
              icon={<Apple className="size-5" aria-hidden="true" />}
            />
          )}
          {playStore && (
            <StoreLink
              href={playStore}
              icon={<Play className="size-5 fill-current" aria-hidden="true" />}
            />
          )}
        </div>
        <div className="hidden shrink-0 flex-col items-center gap-1 lg:flex">
          <div className="rounded-xl bg-white p-2">
            <QrCode value={qrUrl} size={104} />
          </div>
          <p className="text-[10px] leading-tight text-white/60">{t("scan")}</p>
        </div>
      </div>
    </div>
  );
}

function StoreLink({
  href,
  icon,
}: {
  href: string;
  icon: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-white px-4 text-navy transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
    >
      {icon}
      <span className="text-sm font-bold">{href.includes("apps.apple.com") ? "App Store" : "Google Play"}</span>
    </a>
  );
}