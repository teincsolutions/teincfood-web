"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Apple,
  ArrowRight,
  Check,
  Download,
  HardDrive,
  Monitor,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Terminal,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import {
  formatBytes,
  type DesktopRelease,
  type DownloadAsset,
  type DownloadKind,
} from "@/lib/downloads";

type Platform =
  | "ios"
  | "android"
  | "windows"
  | "macos"
  | "linux"
  | "unknown";

type AppChoice = "buyer" | "business" | "desktop";

interface StoreLinks {
  buyer: { appStore: string; playStore: string };
  business: { appStore: string; playStore: string };
}

interface DownloadHubProps {
  release: DesktopRelease | null;
  stores: StoreLinks;
  initialApp?: AppChoice;
}

const ORDER: DownloadKind[] = [
  "windows",
  "macos-arm",
  "macos-intel",
  "linux-appimage",
  "linux-deb",
];

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "unknown";
  const ua = window.navigator.userAgent.toLowerCase();
  const touchPoints = window.navigator.maxTouchPoints ?? 0;

  // Mobile checks must run before desktop. Android user agents contain Linux,
  // and iPadOS can identify itself as macOS.
  if (ua.includes("iphone") || ua.includes("ipod")) return "ios";
  if (ua.includes("ipad") || (touchPoints > 1 && ua.includes("macintosh"))) {
    return "ios";
  }
  if (ua.includes("android")) return "android";
  if (ua.includes("windows") || ua.includes("win32") || ua.includes("win64")) {
    return "windows";
  }
  if (ua.includes("mac os") || ua.includes("macintosh")) return "macos";
  if (ua.includes("linux")) return "linux";
  return "unknown";
}

function isMobilePlatform(platform: Platform): boolean {
  return platform === "ios" || platform === "android";
}

function isDesktopPlatform(platform: Platform): boolean {
  return platform === "windows" || platform === "macos" || platform === "linux";
}

function primaryKindFor(platform: Platform): DownloadKind | null {
  if (platform === "windows") return "windows";
  if (platform === "macos") return "macos-arm";
  if (platform === "linux") return "linux-appimage";
  return null;
}

function PlatformIcon({ kind }: { kind: DownloadKind }) {
  if (kind.startsWith("macos")) {
    return <Apple aria-hidden="true" className="size-5" />;
  }
  if (kind.startsWith("linux")) {
    return <Terminal aria-hidden="true" className="size-5" />;
  }
  if (kind === "windows") {
    return <Monitor aria-hidden="true" className="size-5" />;
  }
  return <HardDrive aria-hidden="true" className="size-5" />;
}

export function DownloadHub({
  release,
  stores,
  initialApp,
}: DownloadHubProps) {
  const t = useTranslations("download");
  const locale = useLocale();
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [app, setApp] = useState<AppChoice>(initialApp ?? "buyer");

  const selectApp = (next: AppChoice) => {
    setApp(next);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("app", next);
      window.history.replaceState(null, "", url);
    }
  };

  useEffect(() => {
    const detected = detectPlatform();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlatform(detected);
    if (!initialApp && isDesktopPlatform(detected)) {
      setApp("desktop");
    }
  }, [initialApp]);

  const assets = useMemo(() => {
    if (!release) return [];
    return ORDER.flatMap((kind) =>
      release.assets.filter((asset) => asset.kind === kind),
    );
  }, [release]);

  const primaryKind = primaryKindFor(platform);
  const primary = primaryKind
    ? assets.find((asset) => asset.kind === primaryKind)
    : undefined;
  const otherAssets = primary
    ? assets.filter((asset) => asset.kind !== primary.kind)
    : assets;

  const platformLabel =
    platform === "unknown" ? "" : t(`platforms.${platform}`);

  const apps: { id: AppChoice; icon: typeof Smartphone }[] = [
    { id: "buyer", icon: Smartphone },
    { id: "business", icon: HardDrive },
    { id: "desktop", icon: Monitor },
  ];

  return (
    <>
      <section className="border-b border-navy/5 bg-surface">
        <div className="container-site py-14 sm:py-20">
          <div className="max-w-3xl">
            <Badge>{t("eyebrow")}</Badge>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-navy sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy/70 sm:text-lg">
              {t("subtitle")}
            </p>
            <p className="mt-4 text-sm text-navy/55">
              {platform === "unknown"
                ? t("detectedUnknown")
                : t("detected", { platform: platformLabel })}
            </p>

            <div
              role="group"
              aria-label={t("appLabel")}
              className="mt-7 grid gap-2 sm:grid-cols-3"
            >
              {apps.map((item) => {
                const Icon = item.icon;
                const active = app === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectApp(item.id)}
                    className={cn(
                      "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800",
                      active
                        ? "border-navy bg-navy text-white"
                        : "border-navy/15 bg-white text-navy/75 hover:border-navy/35 hover:text-navy",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {t(`tabs.${item.id}`)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {app === "buyer" || app === "business" ? (
        <MobileDownloads app={app} stores={stores[app]} />
      ) : (
        <DesktopDownloads
          release={release}
          assets={assets}
          primary={primary}
          otherAssets={otherAssets}
          platform={platform}
          locale={locale}
        />
      )}
    </>
  );
}
const MobileDownloads = ({
  app,
  stores,
}: {
  app: "buyer" | "business";
  stores: { appStore: string; playStore: string };
}) => {
  const t = useTranslations("download");
  const key = app;
  const hasStoreLinks = Boolean(stores.appStore || stores.playStore);

  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-800">
          {t(`tabs.${key}`)}
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          {t("mobile.title")}
        </h2>
        <p className="mt-3 leading-relaxed text-navy/65">
          {t("mobile.subtitle")}
        </p>

        <div className="mt-8 rounded-2xl border border-navy/10 bg-surface p-6 sm:p-8">
          <h3 className="text-xl font-bold text-navy">
            {t(`mobile.${key}Title`)}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-navy/65">
            {t(`mobile.${key}Body`)}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {stores.appStore ? (
              <a
                href={stores.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2.5 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
              >
                <Apple aria-hidden="true" className="size-5" />
                {t("mobile.appStore")}
              </a>
            ) : null}
            {stores.playStore ? (
              <a
                href={stores.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2.5 rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
              >
                <Smartphone aria-hidden="true" className="size-5" />
                {t("mobile.playStore")}
              </a>
            ) : null}
          </div>

          {!hasStoreLinks ? (
            <div className="mt-5 rounded-xl border border-navy/10 bg-white p-4">
              <p className="text-sm leading-relaxed text-navy/65">
                {t("mobile.noLinks")}
              </p>
              <ButtonLink
                href="/contact"
                variant="outline"
                size="sm"
                className="mt-3"
              >
                {t("help.contact")}
              </ButtonLink>
            </div>
          ) : (
            <p className="mt-4 text-xs text-navy/45">{t("mobile.searchHint")}</p>
          )}
        </div>
      </div>
    </Section>
  );
}

function DesktopDownloads({
  release,
  assets,
  primary,
  otherAssets,
  platform,
  locale,
}: {
  release: DesktopRelease | null;
  assets: DownloadAsset[];
  primary: DownloadAsset | undefined;
  otherAssets: DownloadAsset[];
  platform: Platform;
  locale: string;
}) {
  const t = useTranslations("download");
  const mobile = isMobilePlatform(platform);

  return (
    <>
      <Section className="bg-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-800">
            {t("tabs.desktop")}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {t("desktop.title")}
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-navy/65">
            {t("desktop.subtitle")}
          </p>

          {release ? (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-navy/55">
              <span className="rounded-full border border-navy/10 bg-surface px-3 py-1 font-semibold text-navy">
                {t("desktop.version", { version: release.version })}
              </span>
              {release.publishedAt ? (
                <span>
                  {t("desktop.updated", {
                    date: new Date(release.publishedAt).toLocaleDateString(
                      locale,
                      { day: "numeric", month: "short", year: "numeric" },
                    ),
                  })}
                </span>
              ) : null}
              {release.prerelease ? (
                <span className="rounded-full bg-orange/10 px-3 py-1 font-semibold text-orange-800">
                  {t("desktop.preview")}
                </span>
              ) : null}
            </div>
          ) : null}

          {mobile ? (
            <div className="mt-8 rounded-xl border border-navy/10 bg-surface p-6">
              <Monitor aria-hidden="true" className="size-6 text-navy/60" />
              <h3 className="mt-3 font-bold text-navy">
                {t("desktop.mobileNotice")}
              </h3>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="#install"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
                >
                  {t("desktop.installGuide")}
                </a>
                <ButtonLink
                  href="/download?app=buyer"
                  variant="outline"
                  size="md"
                >
                  {t("tabs.buyer")}
                </ButtonLink>
              </div>
            </div>
          ) : !release ? (
            <div className="mt-8 rounded-xl border border-navy/10 bg-surface p-6">
              <HardDrive aria-hidden="true" className="size-6 text-navy/50" />
              <h3 className="mt-3 font-bold text-navy">
                {t("desktop.noReleaseTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">
                {t("desktop.noReleaseBody")}
              </p>
              <ButtonLink href="/contact" className="mt-4" size="md">
                {t("help.contact")}
              </ButtonLink>
            </div>
          ) : platform === "unknown" ? (
            <div className="mt-8 rounded-xl border border-navy/10 bg-surface p-6">
              <h3 className="font-bold text-navy">{t("desktop.choosePlatform")}</h3>
              <p className="mt-2 text-sm text-navy/65">
                {t("detectedUnknown")}
              </p>
            </div>
          ) : (
            <div className="mt-8">
              {primary ? (
                <a
                  href={primary.url}
                  download
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-800 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
                >
                  <Download aria-hidden="true" className="size-4" />
                  {t("desktop.downloadFor", { platform: t(`platforms.${platform}`) })}
                </a>
              ) : null}
              <p className="mt-3 text-xs leading-relaxed text-navy/50">
                {platform === "macos"
                  ? t("desktop.appleSiliconNote")
                  : t("desktop.requirements")}
              </p>
            </div>
          )}

          {release ? (
            <div className="mt-10">
              <h3 className="text-lg font-bold text-navy">
                {t("desktop.allPlatforms")}
              </h3>
              <div className="mt-4 grid gap-3">
                {primary ? (
                  <AssetCard
                    asset={primary}
                    label={t(`assets.${primary.kind}`)}
                    downloadLabel={t("desktop.download")}
                    featured
                  />
                ) : null}
                {otherAssets.map((asset) => (
                  <AssetCard
                    key={asset.kind}
                    asset={asset}
                    label={t(`assets.${asset.kind}`)}
                    downloadLabel={t("desktop.download")}
                  />
                ))}
              </div>
              <p className="mt-4 text-xs text-navy/45">
                {t("desktop.requirements")}
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-navy/10 bg-surface p-5">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-orange-800"
            />
            <p className="text-sm leading-relaxed text-navy/65">
              {t("desktop.autoUpdate")}
            </p>
          </div>
        </div>
      </Section>

      {release?.notes ? (
        <Section className="bg-surface">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <RefreshCw
                aria-hidden="true"
                className="size-5 text-orange-800"
              />
              <h2 className="text-2xl font-extrabold tracking-tight text-navy">
                {t("desktop.releaseNotes", { version: release.version })}
              </h2>
            </div>
            <pre className="mt-5 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-xl border border-navy/10 bg-white p-5 text-sm leading-relaxed text-navy/70">
              {release.notes}
            </pre>
          </div>
        </Section>
      ) : null}

      <Section className="bg-white" id="install">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            {t("install.title")}
          </h2>
          <p className="mt-3 text-navy/65">{t("install.subtitle")}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <InstallStep
              icon={<Monitor aria-hidden="true" className="size-4" />}
              title={t("install.windowsTitle")}
              steps={[
                t("install.windowsStep1"),
                t("install.windowsStep2"),
                t("install.windowsStep3"),
              ]}
            />
            <InstallStep
              icon={<Apple aria-hidden="true" className="size-4" />}
              title={t("install.macosTitle")}
              steps={[
                t("install.macosStep1"),
                t("install.macosStep2"),
                t("install.macosStep3"),
              ]}
            />
            <InstallStep
              icon={<Terminal aria-hidden="true" className="size-4" />}
              title={t("install.linuxTitle")}
              steps={[
                t("install.linuxStep1"),
                t("install.linuxStep2"),
                t("install.linuxStep3"),
              ]}
            />
            <InstallStep
              icon={<HardDrive aria-hidden="true" className="size-4" />}
              title={t("install.posTitle")}
              steps={[
                t("install.posStep1"),
                t("install.posStep2"),
                t("install.posStep3"),
              ]}
            />
          </div>

          <p className="mt-5 text-xs text-navy/45">
            {assets.length > 0 ? t("desktop.requirements") : null}
          </p>
        </div>
      </Section>

      <Section className="bg-surface">
        <div className="mx-auto max-w-3xl rounded-2xl bg-navy px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {t("help.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            {t("help.body")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact" variant="primary" size="lg">
              {t("help.contact")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
            <ButtonLink href="/faq" variant="inverse" size="lg">
              {t("help.faq")}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}

function AssetCard({
  asset,
  label,
  downloadLabel,
  featured,
}: {
  asset: DownloadAsset;
  label: string;
  downloadLabel: string;
  featured?: boolean;
}) {
  return (
    <a
      href={asset.url}
      download
      className={cn(
        "group flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800",
        featured
          ? "border-orange/40 bg-orange/5 hover:bg-orange/10"
          : "border-navy/10 bg-white hover:bg-navy/[0.03]",
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
          <PlatformIcon kind={asset.kind} />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-bold text-navy">{label}</span>
          <span className="block truncate text-xs text-navy/50">
            {asset.name}
          </span>
          {asset.size > 0 ? (
            <span className="block text-xs text-navy/45">
              {formatBytes(asset.size)}
            </span>
          ) : null}
        </span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-orange-800">
        {downloadLabel}
        <Download aria-hidden="true" className="size-4" />
      </span>
    </a>
  );
}

function InstallStep({
  icon,
  title,
  steps,
}: {
  icon: ReactNode;
  title: string;
  steps: string[];
}) {
  return (
    <div className="rounded-xl border border-navy/10 bg-surface p-5">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-navy text-white">
          {icon}
        </span>
        <h3 className="font-bold text-navy">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2">
        {steps.map((step) => (
          <li key={step} className="flex items-start gap-2 text-sm text-navy/65">
            <Check
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-orange-800"
            />
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
