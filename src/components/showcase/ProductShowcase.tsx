"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Laptop,
  Monitor,
  Smartphone,
  Tablet,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  deviceIds as allDeviceIds,
  getDevice,
  isDeviceId,
  type DeviceFamily,
  type DeviceId,
} from "@/config/devices";
import {
  getDefaultDevice,
  getDefaultScreen,
  getScreen,
  getScreenImage,
  getScreensForDevice,
  isScreenCompatible,
  isScreenKey,
  screenKeys as allScreenKeys,
  type ScreenDef,
  type ScreenKey,
} from "@/config/screens";
import { cn } from "@/lib/utils";
import { DeviceFrame } from "./DeviceFrame";
import { ImageLightbox } from "./ImageLightbox";

const familyIcons: Record<DeviceFamily, LucideIcon> = {
  monitor: Monitor,
  laptop: Laptop,
  phone: Smartphone,
  tablet: Tablet,
};

function stageWidth(family: DeviceFamily): string {
  switch (family) {
    case "monitor":
      return "max-w-3xl";
    case "laptop":
      return "max-w-2xl";
    case "tablet":
      return "max-w-[24rem] sm:max-w-[27rem]";
    case "phone":
      return "max-w-[17rem] sm:max-w-[19rem]";
  }
}

export interface ProductShowcaseProps {
  screenKeys: readonly ScreenKey[];
  deviceIds?: readonly DeviceId[];
  initialDevice?: DeviceId;
  initialScreen?: ScreenKey;
  priority?: boolean;
  className?: string;
}

export function ProductShowcase({
  screenKeys,
  deviceIds,
  initialDevice,
  initialScreen,
  priority = false,
  className,
}: ProductShowcaseProps) {
  const t = useTranslations("showcase");

  const requestedScreens = useMemo(() => {
    const seen = new Set<ScreenKey>();
    const valid: ScreenKey[] = [];

    for (const key of screenKeys) {
      if (isScreenKey(key) && !seen.has(key)) {
        seen.add(key);
        valid.push(key);
      }
    }

    return valid.length > 0 ? valid : allScreenKeys;
  }, [screenKeys]);

  const requestedDevices = useMemo<DeviceId[]>(() => {
    const requested = (deviceIds ?? []).filter(isDeviceId);
    const valid = allDeviceIds.filter((id) => requested.includes(id));
    return valid.length > 0 ? valid : [...allDeviceIds];
  }, [deviceIds]);

  const [selection, setSelection] = useState(() => {
    const firstScreen: ScreenKey =
      (initialScreen && requestedScreens.includes(initialScreen)
        ? initialScreen
        : requestedScreens[0]) ?? "desktop:dashboard";

    const preferred =
      initialDevice &&
      requestedDevices.includes(initialDevice) &&
      isScreenCompatible(firstScreen, initialDevice)
        ? initialDevice
        : getDefaultDevice(firstScreen, requestedDevices);

    const deviceId = preferred ?? requestedDevices[0];
    const availableScreens = requestedScreens.filter(
      (key) =>
        isScreenCompatible(key, deviceId) &&
        Boolean(getScreenImage(getScreen(key), deviceId)),
    );
    const screenKey =
      availableScreens.includes(firstScreen) && isScreenCompatible(firstScreen, deviceId)
        ? firstScreen
        : (availableScreens[0] ??
          getDefaultScreen(deviceId, requestedScreens) ??
          firstScreen);

    return { screenKey, deviceId };
  });

  const [hasInteracted, setHasInteracted] = useState(false);
  const [initialScreenKey] = useState(() => selection.screenKey);
  const [lightboxScreen, setLightboxScreen] = useState<ScreenDef>();
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const device = getDevice(selection.deviceId);
  const compatibleScreens = getScreensForDevice(
    selection.deviceId,
    requestedScreens,
  ).filter((key) =>
    Boolean(getScreenImage(getScreen(key), selection.deviceId)),
  );
  const currentIndex = Math.max(
    0,
    compatibleScreens.indexOf(selection.screenKey),
  );
  const currentScreenKey =
    compatibleScreens[currentIndex] ?? selection.screenKey;
  const currentScreen = getScreen(currentScreenKey);
  const currentLabel = t(`screens.${currentScreen.labelKey}`);
  const total = compatibleScreens.length;

  const selectDevice = (deviceId: DeviceId) => {
    if (deviceId === selection.deviceId) return;

    const nextScreens = getScreensForDevice(deviceId, requestedScreens).filter(
      (key) => Boolean(getScreenImage(getScreen(key), deviceId)),
    );
    if (nextScreens.length === 0) return;

    setHasInteracted(true);
    setSelection((previous) => ({
      deviceId,
      screenKey: nextScreens.includes(previous.screenKey)
        ? previous.screenKey
        : nextScreens[0],
    }));
  };

  const selectScreen = (screenKey: ScreenKey) => {
    setHasInteracted(true);
    setSelection((previous) => ({ ...previous, screenKey }));
  };

  const step = (direction: -1 | 1) => {
    const nextKey = compatibleScreens[currentIndex + direction];
    if (!nextKey) return;

    setHasInteracted(true);
    setSelection((previous) => ({ ...previous, screenKey: nextKey }));
  };

  const openLightbox = (screen: ScreenDef) => {
    setLightboxScreen(screen);
    setLightboxOpen(true);
  };

  const status = t("controls.slideStatus", {
    label: currentLabel,
    current: total === 0 ? 0 : currentIndex + 1,
    total,
  });

  const showPriority =
    priority &&
    !hasInteracted &&
    currentScreenKey === initialScreenKey;

  return (
    <div
      className={cn(
        "rounded-3xl border border-navy/10 bg-white p-4 shadow-xl shadow-navy/5 sm:p-6 lg:p-8",
        className,
      )}
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
          {t("controls.title")}
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-navy/60">
          {t("controls.subtitle")}
        </p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-h-[26rem] flex-col items-center justify-center">
          <div className={cn("w-full", stageWidth(device.family))}>
            <DeviceFrame
              screenKey={currentScreenKey}
              device={selection.deviceId}
              sizes={device.imageSizes}
              priority={showPriority}
              className="w-full"
              onActivate={openLightbox}
            />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={currentIndex <= 0}
              aria-label={t("controls.previous")}
              className="inline-flex size-12 items-center justify-center rounded-full border border-navy/10 bg-white text-navy transition-colors hover:border-orange/40 hover:bg-orange/5 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={currentIndex >= total - 1}
              aria-label={t("controls.next")}
              className="inline-flex size-12 items-center justify-center rounded-full border border-navy/10 bg-white text-navy transition-colors hover:border-orange/40 hover:bg-orange/5 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          <p
            aria-live="polite"
            aria-atomic="true"
            className="mt-3 text-center text-xs font-medium text-navy/55"
          >
            {status}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <fieldset className="min-w-0">
            <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy/45">
              {t("controls.deviceLabel")}
            </legend>
            <div className="mt-2 space-y-4">
              {[
                {
                  key: "desktop",
                  ids: requestedDevices.filter((id) => {
                    const family = getDevice(id).family;
                    return family === "monitor" || family === "laptop";
                  }),
                },
                {
                  key: "mobile",
                  ids: requestedDevices.filter(
                    (id) => getDevice(id).family === "phone",
                  ),
                },
                {
                  key: "tablet",
                  ids: requestedDevices.filter(
                    (id) => getDevice(id).family === "tablet",
                  ),
                },
              ]
                .filter((group) => group.ids.length > 0)
                .map((group) => (
                  <div key={group.key}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy/40">
                      {t(`categories.${group.key}`)}
                    </p>
                    <div className="mt-1.5 grid grid-cols-4 gap-2">
                      {group.ids.map((id) => {
                        const option = getDevice(id);
                        const Icon = familyIcons[option.family];
                        const active = id === selection.deviceId;
                        const enabled =
                          getScreensForDevice(id, requestedScreens).length > 0;
                        const label = t(`devices.${id}`);

                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => selectDevice(id)}
                            disabled={!enabled}
                            aria-pressed={active}
                            aria-label={label}
                            title={
                              enabled ? label : t("controls.compatibilityNote")
                            }
                            className={cn(
                              "inline-flex size-12 items-center justify-center rounded-xl border transition-colors",
                              active
                                ? "border-orange bg-orange text-white shadow-sm shadow-orange/20"
                                : "border-navy/10 bg-white text-navy/70 hover:border-orange/40 hover:bg-orange/5",
                              !enabled && "cursor-not-allowed opacity-35",
                            )}
                          >
                            <Icon className="size-5" aria-hidden="true" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy/45">
              {t("controls.screenLabel")}
            </legend>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-2 lg:grid lg:max-h-[22rem] lg:grid-cols-2 lg:overflow-y-auto lg:pr-1">
              {compatibleScreens.map((key) => {
                const screen = getScreen(key);
                const label = t(`screens.${screen.labelKey}`);
                const active = key === currentScreenKey;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectScreen(key)}
                    aria-pressed={active}
                    aria-label={label}
                    title={label}
                    className={cn(
                      "flex w-24 shrink-0 flex-col gap-1.5 rounded-xl border p-1.5 text-left transition-colors lg:w-auto",
                      active
                        ? "border-orange bg-orange/5"
                        : "border-navy/10 bg-white hover:border-orange/30",
                    )}
                  >
                    <ScreenThumbnail screen={screen} />
                    <span
                      className={cn(
                        "line-clamp-1 text-[10px] font-semibold",
                        active ? "text-orange-700" : "text-navy/60",
                      )}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <p className="rounded-xl bg-surface p-3 text-xs leading-relaxed text-navy/55">
            {t("controls.compatibilityNote")}
          </p>
        </div>
      </div>

      {lightboxScreen && getScreenImage(lightboxScreen, selection.deviceId) ? (
        <ImageLightbox
          src={getScreenImage(lightboxScreen, selection.deviceId)!}
          alt={t(`screens.${lightboxScreen.labelKey}`)}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </div>
  );
}

function ScreenThumbnail({ screen }: { screen: ScreenDef }) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={cn(
        "relative block w-full overflow-hidden rounded-lg bg-[linear-gradient(145deg,#fff9f4_0%,#f5f7fb_55%,#fff1e7_100%)] ring-1 ring-inset ring-navy/5 dark:bg-[linear-gradient(145deg,#1c1c24_0%,#23232d_55%,#1c1c24_100%)] dark:ring-white/5",
        screen.surface === "desktop" ? "aspect-video" : "aspect-[9/14]",
      )}
    >
      {screen.image && !failed ? (
        <Image
          src={screen.image}
          alt=""
          fill
          sizes="112px"
          draggable={false}
          className="object-cover object-top"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center p-1"
        >
          <span className="block size-4 rounded bg-orange/70" />
        </span>
      )}
    </span>
  );
}
