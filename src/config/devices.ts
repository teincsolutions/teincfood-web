export const deviceIds = [
  "imac",
  "hp-monitor",
  "macbook",
  "windows-laptop",
  "iphone",
  "android-phone",
  "ipad",
  "android-tablet",
] as const;

export type DeviceId = (typeof deviceIds)[number];
export type LegacyDeviceId = "phone" | "tablet";
export type DeviceSurface = "desktop" | "mobile";
export type DeviceFamily = "monitor" | "laptop" | "phone" | "tablet";

export interface DeviceDef {
  id: DeviceId;
  surface: DeviceSurface;
  family: DeviceFamily;
  /** CSS aspect-ratio for the visible screen area. */
  screenAspect: string;
  /** Responsive hint passed to next/image for the active screenshot. */
  imageSizes: string;
}

export const deviceRegistry: Record<DeviceId, DeviceDef> = {
  imac: {
    id: "imac",
    surface: "desktop",
    family: "monitor",
    screenAspect: "16 / 10",
    imageSizes: "(max-width: 640px) 92vw, (max-width: 1024px) 78vw, 960px",
  },
  "hp-monitor": {
    id: "hp-monitor",
    surface: "desktop",
    family: "monitor",
    screenAspect: "16 / 9",
    imageSizes: "(max-width: 640px) 92vw, (max-width: 1024px) 78vw, 960px",
  },
  macbook: {
    id: "macbook",
    surface: "desktop",
    family: "laptop",
    screenAspect: "16 / 10",
    imageSizes: "(max-width: 640px) 92vw, (max-width: 1024px) 74vw, 860px",
  },
  "windows-laptop": {
    id: "windows-laptop",
    surface: "desktop",
    family: "laptop",
    screenAspect: "16 / 10",
    imageSizes: "(max-width: 640px) 92vw, (max-width: 1024px) 74vw, 860px",
  },
  iphone: {
    id: "iphone",
    surface: "mobile",
    family: "phone",
    screenAspect: "9 / 19.5",
    imageSizes: "(max-width: 640px) 64vw, 340px",
  },
  "android-phone": {
    id: "android-phone",
    surface: "mobile",
    family: "phone",
    screenAspect: "9 / 20",
    imageSizes: "(max-width: 640px) 64vw, 340px",
  },
  ipad: {
    id: "ipad",
    surface: "mobile",
    family: "tablet",
    screenAspect: "3 / 4",
    imageSizes: "(max-width: 640px) 82vw, 520px",
  },
  "android-tablet": {
    id: "android-tablet",
    surface: "mobile",
    family: "tablet",
    screenAspect: "3 / 4",
    imageSizes: "(max-width: 640px) 82vw, 520px",
  },
};

/** Older call sites used phone/tablet. Keep them working. */
export const legacyDeviceMap: Record<LegacyDeviceId, DeviceId> = {
  phone: "iphone",
  tablet: "ipad",
};

export function isDeviceId(value: string): value is DeviceId {
  return (deviceIds as readonly string[]).includes(value);
}

export function getDevice(device: DeviceId | LegacyDeviceId): DeviceDef {
  if (device === "phone" || device === "tablet") {
    return deviceRegistry[legacyDeviceMap[device]];
  }
  return deviceRegistry[device];
}

/** Devices that can display a given surface, optionally scoped to a subset. */
export function devicesForSurface(
  surface: DeviceSurface,
  allowed: readonly DeviceId[] = deviceIds,
): DeviceId[] {
  return allowed.filter((id) => getDevice(id).surface === surface);
}

export function defaultDeviceForSurface(surface: DeviceSurface): DeviceId {
  return surface === "desktop" ? "imac" : "iphone";
}
