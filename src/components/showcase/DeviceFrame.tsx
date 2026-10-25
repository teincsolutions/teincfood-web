"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  getDevice,
  type DeviceDef,
  type DeviceId,
  type LegacyDeviceId,
} from "@/config/devices";
import {
  getDefaultDevice,
  getScreen,
  getScreenImage,
  type ScreenDef,
  type ScreenKey,
} from "@/config/screens";
import { cn } from "@/lib/utils";
import { ImageLightbox } from "./ImageLightbox";
import { ScreenImage } from "./ScreenImage";

export type DeviceChoice = DeviceId | LegacyDeviceId;

export interface DeviceFrameProps {
  screenKey: ScreenKey;
  className?: string;
  priority?: boolean;
  /** Legacy "phone" / "tablet" values are still accepted. */
  device?: DeviceChoice;
  /** Override the responsive image sizes hint. */
  sizes?: string;
  /** Let a parent own the lightbox instead of rendering one per frame. */
  onActivate?: (_screen: ScreenDef, _device: DeviceId) => void;
}

export function DeviceFrame({
  screenKey,
  className,
  priority = false,
  device,
  sizes,
  onActivate,
}: DeviceFrameProps) {
  const t = useTranslations("showcase");
  const screen = getScreen(screenKey);
  const resolvedDevice = getDevice(
    device ?? getDefaultDevice(screenKey) ?? "iphone",
  );
  const image = getScreenImage(screen, resolvedDevice.id);
  const label = t(`screens.${screen.labelKey}`);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [failedSrc, setFailedSrc] = useState<string>();
  const interactive = Boolean(image) && failedSrc !== image;

  const activate = () => {
    if (!interactive) return;
    if (onActivate) {
      onActivate(screen, resolvedDevice.id);
      return;
    }
    setLightboxOpen(true);
  };

  return (
    <>
      <div className={cn("relative select-none", className)}>
        <DeviceChassis device={resolvedDevice}>
          <ScreenPanel
            device={resolvedDevice}
            screen={screen}
            image={image}
            alt={label}
            activationLabel={t("controls.viewFullscreen", { label })}
            sizes={sizes ?? resolvedDevice.imageSizes}
            priority={priority}
            interactive={interactive}
            onActivate={activate}
            onLoadError={setFailedSrc}
          />
        </DeviceChassis>
      </div>

      {!onActivate && interactive && image ? (
        <ImageLightbox
          src={image}
          alt={label}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </>
  );
}

function ScreenPanel({
  device,
  screen,
  image,
  alt,
  activationLabel,
  sizes,
  priority,
  interactive,
  onActivate,
  onLoadError,
}: {
  device: DeviceDef;
  screen: ScreenDef;
  image?: string;
  alt: string;
  activationLabel: string;
  sizes: string;
  priority: boolean;
  interactive: boolean;
  onActivate: () => void;
  onLoadError: (_src: string) => void;
}) {
  return (
    <div
      className="relative w-full overflow-hidden bg-[#08080c]"
      style={{ aspectRatio: device.screenAspect }}
    >
      <ScreenImage
        screen={screen}
        image={image}
        alt={alt}
        sizes={sizes}
        priority={priority}
        onLoadError={onLoadError}
      />

      {/* Front-facing camera hardware drawn over the screen where a real
          device would hide it in the bezel/notch. */}
      {device.id === "iphone" ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[1.2%] z-20 flex h-[2.8%] w-[32%] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-[4%] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
        >
          <span className="block size-[38%] rounded-full bg-[#111116] ring-1 ring-white/10" />
        </span>
      ) : null}

      {device.id === "android-phone" ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[1.4%] z-20 size-[0.55rem] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10"
        />
      ) : null}

      {interactive ? (
        <button
          type="button"
          onClick={onActivate}
          aria-label={activationLabel}
          className="group/screen absolute inset-0 z-10 cursor-zoom-in rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
        >
          <span className="pointer-events-none absolute bottom-2 right-2 inline-flex size-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity group-hover/screen:opacity-100 group-focus-visible/screen:opacity-100">
            <ZoomIn className="size-4" aria-hidden="true" />
          </span>
        </button>
      ) : null}
    </div>
  );
}

function DeviceChassis({
  device,
  children,
}: {
  device: DeviceDef;
  children: ReactNode;
}) {
  switch (device.id) {
    case "imac":
      return <IMacChassis>{children}</IMacChassis>;
    case "hp-monitor":
      return <HpMonitorChassis>{children}</HpMonitorChassis>;
    case "macbook":
      return <MacBookChassis>{children}</MacBookChassis>;
    case "windows-laptop":
      return <WindowsLaptopChassis>{children}</WindowsLaptopChassis>;
    case "iphone":
      return <IPhoneChassis>{children}</IPhoneChassis>;
    case "android-phone":
      return <AndroidPhoneChassis>{children}</AndroidPhoneChassis>;
    case "ipad":
      return <IPadChassis>{children}</IPadChassis>;
    case "android-tablet":
      return <AndroidTabletChassis>{children}</AndroidTabletChassis>;
  }
}

function IMacChassis({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative w-full rounded-[1.15rem] bg-[linear-gradient(180deg,#fafafa_0%,#e4e4e7_55%,#a1a1aa_100%)] p-2 pb-5 pt-4 shadow-[0_30px_60px_-24px_rgba(15,23,42,0.6)] ring-1 ring-black/10 sm:p-2.5 sm:pb-6 sm:pt-4">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1.5 size-1.5 -translate-x-1/2 rounded-full bg-[#2a2a2e] ring-1 ring-white/40"
        />
        <div className="overflow-hidden rounded-[0.65rem] bg-black ring-1 ring-black/50">
          {children}
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-zinc-500/40"
        />
      </div>
      <div
        aria-hidden="true"
        className="h-7 w-[8%] bg-[linear-gradient(90deg,#a1a1aa,#f4f4f5_45%,#a1a1aa)] sm:h-9"
      />
      <div
        aria-hidden="true"
        className="h-2 w-[36%] rounded-b-[0.6rem] rounded-t-sm bg-[linear-gradient(180deg,#e4e4e7,#a1a1aa)] shadow-md sm:h-2.5"
      />
    </div>
  );
}

function HpMonitorChassis({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative w-full rounded-[0.45rem] bg-[linear-gradient(180deg,#3f3f46_0%,#18181b_45%,#09090b_100%)] p-1.5 pb-4 pt-3 shadow-[0_28px_55px_-24px_rgba(15,23,42,0.7)] ring-1 ring-black/60 sm:p-2 sm:pb-5 sm:pt-3.5">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1.5 size-1 -translate-x-1/2 rounded-full bg-[#0a0a0a] ring-1 ring-white/15"
        />
        <div className="overflow-hidden rounded-[0.2rem] bg-black ring-1 ring-black/80">
          {children}
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-1.5 right-3 size-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
        />
      </div>
      <div
        aria-hidden="true"
        className="h-7 w-[7%] bg-[linear-gradient(90deg,#27272a,#71717a_45%,#27272a)] sm:h-9"
      />
      <div
        aria-hidden="true"
        className="h-1.5 w-[46%] rounded-[2px] bg-[linear-gradient(180deg,#52525b,#27272a)] shadow-md sm:h-2"
      />
    </div>
  );
}

function MacBookChassis({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative w-full rounded-t-[0.9rem] bg-[linear-gradient(180deg,#fafafa_0%,#d4d4d8_100%)] p-1.5 pb-3 pt-2.5 shadow-[0_25px_50px_-24px_rgba(15,23,42,0.55)] ring-1 ring-black/10 sm:p-2 sm:pb-3.5 sm:pt-3">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1 size-1 -translate-x-1/2 rounded-full bg-[#18181b] ring-1 ring-white/50"
        />
        <div className="overflow-hidden rounded-[0.3rem] bg-black ring-1 ring-black/40">
          {children}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="relative h-2.5 w-full origin-center scale-x-105 rounded-b-[0.7rem] bg-[linear-gradient(180deg,#e4e4e7_0%,#a1a1aa_100%)] shadow-lg sm:h-3"
      >
        <span className="absolute left-1/2 top-0 h-1.5 w-[14%] -translate-x-1/2 rounded-b-md bg-zinc-500/35" />
      </div>
      <div
        aria-hidden="true"
        className="h-1 w-[16%] rounded-b bg-zinc-400/60"
      />
    </div>
  );
}

function WindowsLaptopChassis({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative w-full rounded-t-[0.55rem] bg-[linear-gradient(180deg,#3f3f46_0%,#18181b_100%)] p-2 pb-4 pt-3 shadow-[0_28px_55px_-24px_rgba(15,23,42,0.7)] ring-1 ring-black/60 sm:p-2.5 sm:pb-4">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1.5 size-1 -translate-x-1/2 rounded-full bg-[#09090b] ring-1 ring-white/20"
        />
        <div className="overflow-hidden rounded-[0.15rem] bg-black ring-1 ring-black/80">
          {children}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="relative h-3 w-full origin-center scale-x-105 overflow-hidden rounded-b-[0.45rem] bg-[linear-gradient(180deg,#52525b_0%,#27272a_100%)] shadow-lg sm:h-3.5"
      >
        <span className="absolute inset-x-[5%] top-1 h-1/2 rounded-sm opacity-30 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.6)_0_1px,transparent_1px_10px)]" />
        <span className="absolute bottom-0.5 left-1/2 h-0.5 w-[18%] -translate-x-1/2 rounded-full bg-black/30" />
      </div>
    </div>
  );
}

function IPhoneChassis({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="relative rounded-[2.25rem] bg-[linear-gradient(145deg,#71717a_0%,#27272a_40%,#09090b_100%)] p-1 shadow-[0_28px_55px_-22px_rgba(15,23,42,0.7)] ring-1 ring-black/70">
        <div className="overflow-hidden rounded-[1.95rem] bg-black ring-1 ring-black/80">
          {children}
        </div>
      </div>
      <span
        aria-hidden="true"
        className="absolute -left-[2px] top-[20%] h-[7%] w-[2px] rounded-l bg-zinc-600"
      />
      <span
        aria-hidden="true"
        className="absolute -left-[2px] top-[30%] h-[5%] w-[2px] rounded-l bg-zinc-600"
      />
      <span
        aria-hidden="true"
        className="absolute -right-[2px] top-[24%] h-[11%] w-[2px] rounded-r bg-zinc-500"
      />
    </div>
  );
}

function AndroidPhoneChassis({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="relative rounded-[1.65rem] bg-[linear-gradient(145deg,#52525b_0%,#18181b_45%,#09090b_100%)] p-[3px] shadow-[0_28px_55px_-22px_rgba(15,23,42,0.7)] ring-1 ring-black/70">
        <div className="overflow-hidden rounded-[1.4rem] bg-black ring-1 ring-black/80">
          {children}
        </div>
      </div>
      <span
        aria-hidden="true"
        className="absolute -right-[2px] top-[18%] h-[9%] w-[2px] rounded-r bg-zinc-500"
      />
      <span
        aria-hidden="true"
        className="absolute -right-[2px] top-[29%] h-[6%] w-[2px] rounded-r bg-zinc-500"
      />
    </div>
  );
}

function IPadChassis({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-[1.35rem] bg-[linear-gradient(145deg,#f4f4f5_0%,#d4d4d8_45%,#a1a1aa_100%)] p-2 pt-3 shadow-[0_28px_55px_-24px_rgba(15,23,42,0.55)] ring-1 ring-black/15 sm:p-2.5 sm:pt-3.5">
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1.5 size-1 -translate-x-1/2 rounded-full bg-[#18181b] ring-1 ring-white/50"
      />
      <div className="overflow-hidden rounded-[0.85rem] bg-black ring-1 ring-black/40">
        {children}
      </div>
    </div>
  );
}

function AndroidTabletChassis({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-[1.1rem] bg-[linear-gradient(145deg,#3f3f46_0%,#18181b_50%,#09090b_100%)] p-2.5 pt-4 shadow-[0_28px_55px_-24px_rgba(15,23,42,0.7)] ring-1 ring-black/60 sm:p-3 sm:pt-4">
      <span
        aria-hidden="true"
        className="absolute left-[9%] top-1.5 size-1.5 rounded-full bg-[#09090b] ring-1 ring-white/20"
      />
      <div className="overflow-hidden rounded-[0.55rem] bg-black ring-1 ring-black/80">
        {children}
      </div>
    </div>
  );
}
