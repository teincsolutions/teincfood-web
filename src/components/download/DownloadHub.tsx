"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Apple,
  Check,
  Download,
  HardDrive,
  Monitor,
  Smartphone,
  Terminal,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  assetLabel,
  formatBytes,
  type DesktopRelease,
  type DownloadAsset,
  type DownloadKind,
} from "@/lib/downloads";

type OS = "windows" | "macos" | "linux" | "unknown";

interface StoreLinks {
  buyer: { appStore: string; playStore: string };
  business: { appStore: string; playStore: string };
}

interface DownloadHubProps {
  release: DesktopRelease | null;
  stores: StoreLinks;
}

const ORDER: DownloadKind[] = [
  "windows",
  "macos-arm",
  "macos-intel",
  "linux-appimage",
  "linux-deb",
];

function detectOS(): OS {
  if (typeof window === "undefined") return "unknown";
  const ua = window.navigator.userAgent.toLowerCase();
  const platform =
    (
      window.navigator as Navigator & {
        userAgentData?: { platform?: string };
      }
    ).userAgentData?.platform?.toLowerCase() ??
    window.navigator.platform?.toLowerCase() ??
    "";

  if (platform.includes("win") || ua.includes("windows")) return "windows";
  if (platform.includes("mac") || ua.includes("mac os")) return "macos";
  if (platform.includes("linux") || ua.includes("linux")) return "linux";
  return "unknown";
}

function primaryKindFor(os: OS): DownloadKind | null {
  if (os === "windows") return "windows";
  if (os === "macos") return "macos-arm";
  if (os === "linux") return "linux-appimage";
  return null;
}

function osLabel(os: OS): string {
  if (os === "windows") return "Windows";
  if (os === "macos") return "macOS";
  if (os === "linux") return "Linux";
  return "your computer";
}

function PlatformIcon({ kind }: { kind: DownloadKind }) {
  if (kind.startsWith("macos")) return <Apple className="size-5" />;
  if (kind.startsWith("linux")) return <Terminal className="size-5" />;
  return <Monitor className="size-5" />;
}

function AssetCard({ asset, featured }: { asset: DownloadAsset; featured?: boolean }) {
  return (
    <a
      href={asset.url}
      download
      className={cn(
        "group flex items-center justify-between gap-4 rounded-2xl border p-5 transition-colors",
        featured
          ? "border-orange/40 bg-orange/5 hover:bg-orange/10"
          : "border-navy/10 bg-white hover:bg-navy/5",
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
          <PlatformIcon kind={asset.kind} />
        </span>
        <div className="min-w-0">
          <div className="truncate font-bold text-navy">{assetLabel(asset.kind)}</div>
          <div className="truncate text-xs text-navy/45">{asset.name}</div>
          {asset.size > 0 && <div className="mt-0.5 text-xs text-navy/40">{formatBytes(asset.size)}</div>}
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white">
        <Download className="size-4" />
        Download
      </span>
    </a>
  );
}

export function DownloadHub({ release, stores }: DownloadHubProps) {
  const [os, setOs] = useState<OS>("unknown");

  useEffect(() => {
    // The user agent is only readable in the browser; this is the one
    // legitimate external-system read in this component.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOs(detectOS());
  }, []);

  const assets = useMemo(() => {
    if (!release) return [];
    return ORDER.flatMap((kind) => release.assets.filter((asset) => asset.kind === kind));
  }, [release]);

  const primaryKind = primaryKindFor(os);
  const primary = primaryKind ? assets.find((asset) => asset.kind === primaryKind) : undefined;
  const otherPlatforms = primary ? assets.filter((asset) => asset.kind !== primary.kind) : assets;

  return (
    <>
      {/* Hero / primary download */}
      <Section className="bg-surface">
        <Container className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge>Free download</Badge>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Download TeincFood Desktop
            </h1>
            <p className="mt-4 text-lg text-navy/70">
              POS, orders, kitchen display, menu, team and fleet — on Windows, macOS and Linux,
              including POS terminals with a dual-screen customer display.
            </p>

            {release ? (
              <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 text-sm text-navy/55">
                <span className="rounded-full border border-navy/10 bg-white px-3 py-1 font-semibold text-navy">
                  Version {release.version}
                </span>
                {release.publishedAt && (
                  <span>
                    Updated{" "}
                    {new Date(release.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
                {release.prerelease && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-800">
                    Preview build
                  </span>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-navy/50">
                The latest installers are being published. Chat with us if you need a build today.
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {primary ? (
                <a
                  href={primary.url}
                  download
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-8 sm:py-4 sm:text-lg"
                >
                  <Download className="size-4" />
                  Download for {osLabel(os)}
                </a>
              ) : release ? (
                <a
                  href="#platforms"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-8 sm:py-4 sm:text-lg"
                >
                  <Download className="size-4" />
                  Choose your platform
                </a>
              ) : (
                <ButtonLink href="/contact" variant="primary" size="lg">
                  Talk to us
                </ButtonLink>
              )}
              <a
                href="#install"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-8 sm:py-4 sm:text-lg"
              >
                Installation guide
              </a>
            </div>

            {primary && primary.size > 0 && (
              <p className="mt-3 text-xs text-navy/40">
                {os === "macos"
                  ? "Apple Silicon build selected. Intel Macs: choose the Intel download below."
                  : `${primary.name} · ${formatBytes(primary.size)}`}
              </p>
            )}
          </div>
        </Container>
      </Section>

      {/* All platforms */}
      <Section className="bg-white" id="platforms">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              All platforms
            </h2>
            <p className="mt-3 text-navy/60">
              Windows 10 or later · macOS 12 Monterey or later · Ubuntu 20.04 or equivalent
            </p>
          </div>

          {release ? (
            <div className="mx-auto mt-10 grid max-w-3xl gap-3">
              {primary && <AssetCard asset={primary} featured />}
              {otherPlatforms.map((asset) => (
                <AssetCard key={asset.kind} asset={asset} />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-navy/10 bg-surface p-8 text-center">
              <HardDrive className="mx-auto size-8 text-navy/40" />
              <h3 className="mt-3 font-bold text-navy">Installers are being published</h3>
              <p className="mt-2 text-sm text-navy/60">
                The desktop download links go live with the next release. In the meantime, contact
                us and we will send you the current build.
              </p>
              <div className="mt-5">
                <ButtonLink href="/contact" variant="primary" size="md">
                  Contact us
                </ButtonLink>
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Install guide */}
      <Section className="bg-surface" id="install">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
              Installation guide
            </h2>
            <p className="mt-3 text-navy/60">
              Install TeincFood Desktop, connect a receipt printer and set up the customer display.
            </p>

            <div className="mt-8 space-y-4">
              <InstallStep
                icon={<Monitor className="size-5" />}
                title="Windows"
                steps={[
                  "Run the downloaded .exe installer.",
                  "If SmartScreen appears, choose More info → Run anyway.",
                  "Open TeincFood Desktop and sign in with your TeincFood Business account.",
                ]}
              />
              <InstallStep
                icon={<Apple className="size-5" />}
                title="macOS"
                steps={[
                  "Open the .dmg and drag TeincFood Desktop into Applications.",
                  "The first time, right-click the app and choose Open (Gatekeeper).",
                  "Sign in with your TeincFood Business account.",
                ]}
              />
              <InstallStep
                icon={<Terminal className="size-5" />}
                title="Linux"
                steps={[
                  "AppImage: make it executable (chmod +x) and run it.",
                  "Debian/Ubuntu: sudo apt install ./TeincFood*.deb.",
                  "Start it from your applications menu and sign in.",
                ]}
              />
              <InstallStep
                icon={<HardDrive className="size-5" />}
                title="POS terminal and dual screen"
                steps={[
                  "Use the Windows or Linux build on the terminal.",
                  "Open Settings → Devices to connect a receipt printer.",
                  "Enable the customer display on the second screen.",
                ]}
              />
            </div>

            <div className="mt-8 rounded-2xl border border-navy/10 bg-white p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-orange" />
                <p className="text-sm text-navy/65">
                  TeincFood Desktop updates itself automatically. When a new version is available
                  it downloads in the background and applies on restart — no reinstall needed.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mobile apps */}
      <Section className="bg-white">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <Smartphone className="size-5 text-orange" />
              <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                Mobile apps
              </h2>
            </div>
            <p className="mt-3 text-navy/60">
              TeincFood is the buyer app. TeincFood Business is for merchants, fleet managers and
              riders.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <MobileCard
                title="TeincFood"
                description="Order food, pay and track delivery."
                appStore={stores.buyer.appStore}
                playStore={stores.buyer.playStore}
              />
              <MobileCard
                title="TeincFood Business"
                description="Orders, menu, POS, wallet and fleet tools."
                appStore={stores.business.appStore}
                playStore={stores.business.playStore}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Release notes */}
      {release?.notes && (
        <Section className="bg-surface">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3">
                <RefreshCw className="size-5 text-orange" />
                <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                  What&apos;s new in {release.version}
                </h2>
              </div>
              <pre className="mt-5 max-h-80 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-navy/10 bg-white p-5 text-sm leading-relaxed text-navy/70">
                {release.notes}
              </pre>
            </div>
          </Container>
        </Section>
      )}

      {/* Help */}
      <Section className="bg-white">
        <Container>
          <div className="mx-auto max-w-3xl rounded-3xl bg-navy px-6 py-10 text-center sm:px-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Need help getting set up?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              Chat with the assistant on this site for installation help, or read the guides inside
              the app under Profile → Help.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/contact" variant="primary" size="lg">
                Contact support
                <ArrowRight className="ml-2 size-4" />
              </ButtonLink>
              <ButtonLink href="/faq" variant="secondary" size="lg">
                Read the FAQ
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
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
    <div className="rounded-2xl border border-navy/10 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-9 items-center justify-center rounded-lg bg-navy text-white">
          {icon}
        </span>
        <h3 className="font-bold text-navy">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2">
        {steps.map((step) => (
          <li key={step} className="flex items-start gap-2 text-sm text-navy/65">
            <Check className="mt-0.5 size-4 shrink-0 text-orange" />
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileCard({
  title,
  description,
  appStore,
  playStore,
}: {
  title: string;
  description: string;
  appStore: string;
  playStore: string;
}) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-surface p-5">
      <h3 className="font-bold text-navy">{title}</h3>
      <p className="mt-1 text-sm text-navy/55">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {appStore ? (
          <a
            href={appStore}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy/5"
          >
            App Store
          </a>
        ) : null}
        {playStore ? (
          <a
            href={playStore}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy/5"
          >
            Google Play
          </a>
        ) : null}
        {!appStore && !playStore ? (
          <span className="text-xs text-navy/45">
            Search “TeincFood” on the App Store or Google Play.
          </span>
        ) : null}
      </div>
    </div>
  );
}
