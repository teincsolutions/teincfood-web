import type { ReactNode } from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Download, Monitor, Apple, Terminal } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
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
    path: "/desktop/downloads",
    title: `${t("title")} — Downloads`,
    description: t("description"),
    images: ["/icon.png"],
  });
}

export default async function DesktopDownloadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "desktop.downloads" });

  return (
    <>
      <Section className="bg-surface">
        <Container className="py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge>{t("badge")}</Badge>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-navy/70">{t("version", { version: "1.0.0" })}</p>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container>
          <div className="mx-auto max-w-2xl space-y-4">
            <DownloadCard
              platform="Windows"
              description="Windows 10 or later"
              icon={<Monitor className="size-6" />}
              fileName="TeincFood.Business_1.0.0_x64-setup.exe"
              size="3.4 MB"
              url="https://github.com/teincsolutions/teincfood-business-desktop/releases/download/v1.0.0/TeincFood.Business_1.0.0_x64-setup.exe"
            />
            <DownloadCard
              platform="macOS (Apple Silicon)"
              description="Mac with M1/M2/M3 chip"
              icon={<Apple className="size-6" />}
              fileName="TeincFood.Business_1.0.0_aarch64.dmg"
              size="4.2 MB"
              url="https://github.com/teincsolutions/teincfood-business-desktop/releases/download/v1.0.0/TeincFood.Business_1.0.0_aarch64.dmg"
            />
            <DownloadCard
              platform="macOS (Intel)"
              description="Mac with Intel processor"
              icon={<Apple className="size-6" />}
              fileName="TeincFood.Business_1.0.0_x64.dmg"
              size="4.7 MB"
              url="https://github.com/teincsolutions/teincfood-business-desktop/releases/download/v1.0.0/TeincFood.Business_1.0.0_x64.dmg"
            />
            <DownloadCard
              platform="Linux (Debian/Ubuntu)"
              description="Ubuntu 20.04 or later"
              icon={<Terminal className="size-6" />}
              fileName="TeincFood.Business_1.0.0_amd64.deb"
              size="5.1 MB"
              url="https://github.com/teincsolutions/teincfood-business-desktop/releases/download/v1.0.0/TeincFood.Business_1.0.0_amd64.deb"
            />
            <DownloadCard
              platform="Linux (AppImage)"
              description="Universal Linux"
              icon={<Terminal className="size-6" />}
              fileName="TeincFood.Business_1.0.0_amd64.AppImage"
              size="82.5 MB"
              url="https://github.com/teincsolutions/teincfood-business-desktop/releases/download/v1.0.0/TeincFood.Business_1.0.0_amd64.AppImage"
            />
          </div>
        </Container>
      </Section>

      {/* System Requirements */}
      <Section className="bg-surface">
        <Container>
          <SectionHeading title={t("requirements.title")} />
          <div className="mt-8 mx-auto max-w-2xl grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-navy/10 bg-white p-6">
              <h3 className="font-bold text-navy">Windows</h3>
              <ul className="mt-3 space-y-2 text-sm text-navy/60">
                <li>Windows 10 (64-bit) or later</li>
                <li>4 GB RAM minimum</li>
                <li>500 MB available disk space</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-navy/10 bg-white p-6">
              <h3 className="font-bold text-navy">macOS</h3>
              <ul className="mt-3 space-y-2 text-sm text-navy/60">
                <li>macOS 12 Monterey or later</li>
                <li>4 GB RAM minimum</li>
                <li>Apple Silicon or Intel processor</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-navy/10 bg-white p-6">
              <h3 className="font-bold text-navy">Linux</h3>
              <ul className="mt-3 space-y-2 text-sm text-navy/60">
                <li>Ubuntu 20.04 or equivalent</li>
                <li>4 GB RAM minimum</li>
                <li>X11 or Wayland display server</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-navy/10 bg-white p-6">
              <h3 className="font-bold text-navy">POS Terminal</h3>
              <ul className="mt-3 space-y-2 text-sm text-navy/60">
                <li>Touch screen display</li>
                <li>Windows or Linux OS</li>
                <li>Receipt printer (optional)</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function DownloadCard({
  platform,
  description,
  icon,
  fileName,
  size,
  url,
}: {
  platform: string;
  description: string;
  icon: ReactNode;
  fileName: string;
  size: string;
  url: string;
}) {
  return (
    <a
      href={url}
      download
      className="flex items-center justify-between rounded-xl border border-navy/10 bg-surface p-6 transition-colors hover:bg-navy/5"
    >
      <div className="flex items-center gap-4">
        <span className="inline-flex size-12 items-center justify-center rounded-xl bg-navy text-white">
          {icon}
        </span>
        <div>
          <div className="font-bold text-navy">{platform}</div>
          <div className="text-sm text-navy/50">{description}</div>
          <div className="mt-1 text-xs text-navy/40">{fileName}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-navy/50">{size}</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white">
          <Download className="size-4" />
          Download
        </span>
      </div>
    </a>
  );
}
