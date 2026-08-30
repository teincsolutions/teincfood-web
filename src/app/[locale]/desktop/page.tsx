import type { ReactNode } from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Monitor, LayoutDashboard, ShoppingCart, Users, Download, Apple, Terminal } from "lucide-react";
import { DesktopFrame } from "@/components/showcase/DesktopFrame";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { StepsSection } from "@/components/sections/StepsSection";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { PlatformBadge } from "@/components/brand/PlatformBadges";
import { localizeMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.desktop" });
  return localizeMetadata({
    locale,
    path: "/desktop",
    title: t("title"),
    description: t("description"),
    images: ["/icon.png"],
  });
}

export default async function DesktopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "desktop.hero" });
  const tPlatforms = await getTranslations({ locale, namespace: "desktop.platforms" });
  const tDownloads = await getTranslations({ locale, namespace: "desktop.downloads" });

  return (
    <>
      {/* Hero */}
      <Section className="bg-surface">
        <Container className="py-20 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge>{t("eyebrow")}</Badge>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-navy/70">
              {t("subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="#downloads" variant="primary" size="lg">
                <Download className="mr-2 size-4" />
                {t("cta")}
              </ButtonLink>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
            <DesktopFrame screenKey="desktop:dashboard" priority className="w-full max-w-4xl" />
          </div>
        </Container>
      </Section>

      {/* Platform Badges */}
      <Section className="bg-white">
        <Container>
          <SectionHeading
            title={tPlatforms("title")}
            subtitle={tPlatforms("subtitle")}
          />
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <PlatformBadge platform="windows" url="#" />
            <PlatformBadge platform="macos-silicon" url="#" />
            <PlatformBadge platform="macos-intel" url="#" />
            <PlatformBadge platform="linux" url="#" />
          </div>
        </Container>
      </Section>

      {/* Features */}
      <FeatureCards ns="desktop.features" icons={[LayoutDashboard, ShoppingCart, Users]} />

      {/* Screenshots Grid */}
      <Section className="bg-surface">
        <Container>
          <SectionHeading
            title="Built for serious operations"
            subtitle="Everything you need to manage your restaurant or fleet from one screen."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <DesktopFrame screenKey="desktop:pos" className="w-full" />
            <DesktopFrame screenKey="desktop:kitchen" className="w-full" />
            <DesktopFrame screenKey="desktop:menu" className="w-full" />
            <DesktopFrame screenKey="desktop:analytics" className="w-full" />
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <StepsSection ns="desktop.steps" />

      {/* Download Section */}
      <Section id="downloads" className="bg-white">
        <Container>
          <SectionHeading
            title={tDownloads("title")}
            subtitle={tDownloads("subtitle")}
          />
          <div className="mt-12 mx-auto max-w-2xl space-y-4">
            <DownloadCard
              platform="Windows"
              icon={<Monitor className="size-5" />}
              fileName="TeincFood.Business_1.0.0_x64-setup.exe"
              size="3.4 MB"
              url="#"
            />
            <DownloadCard
              platform="macOS (Apple Silicon)"
              icon={<Apple className="size-5" />}
              fileName="TeincFood.Business_1.0.0_aarch64.dmg"
              size="4.2 MB"
              url="#"
            />
            <DownloadCard
              platform="macOS (Intel)"
              icon={<Apple className="size-5" />}
              fileName="TeincFood.Business_1.0.0_x64.dmg"
              size="4.7 MB"
              url="#"
            />
            <DownloadCard
              platform="Linux (Debian/Ubuntu)"
              icon={<Terminal className="size-5" />}
              fileName="TeincFood.Business_1.0.0_amd64.deb"
              size="5.1 MB"
              url="#"
            />
            <DownloadCard
              platform="Linux (AppImage)"
              icon={<Terminal className="size-5" />}
              fileName="TeincFood.Business_1.0.0_amd64.AppImage"
              size="82.5 MB"
              url="#"
            />
          </div>
          <p className="mt-6 text-center text-sm text-navy/50">
            Version 1.0.0 • Requires Windows 10+, macOS 12+, or Ubuntu 20+
          </p>
        </Container>
      </Section>
    </>
  );
}

function DownloadCard({
  platform,
  icon,
  fileName,
  size,
  url,
}: {
  platform: string;
  icon: ReactNode;
  fileName: string;
  size: string;
  url: string;
}) {
  return (
    <a
      href={url}
      download
      className="flex items-center justify-between rounded-xl border border-navy/10 bg-surface p-4 transition-colors hover:bg-navy/5"
    >
      <div className="flex items-center gap-4">
        <span className="inline-flex size-10 items-center justify-center rounded-lg bg-navy text-white">
          {icon}
        </span>
        <div>
          <div className="font-semibold text-navy">{platform}</div>
          <div className="text-xs text-navy/50">{fileName}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-navy/50">{size}</span>
        <Download className="size-4 text-navy/50" />
      </div>
    </a>
  );
}
