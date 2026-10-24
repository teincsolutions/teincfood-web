"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  initObservability,
  createWebAdapter,
  getObservability,
} from "@teincfood/observability";
import { locales } from "@/config/i18n";
import { telemetryConfig } from "@/config/site";

let started = false;

/**
 * Initializes @teincfood/observability once at app bootstrap (called from a
 * client mount in the root layout — fire-and-forget, idempotent, SSR-safe).
 * Telemetry flows to the shared collector; with no endpoint configured the
 * library safely no-ops (console in dev, silent in prod). Init failures never
 * break the app.
 */
export function ensureObservability(): void {
  if (started) return;
  if (typeof window === "undefined") return;
  started = true;

  void initObservability({
    app: "teincfood-web",
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
    env: telemetryConfig.env,
    ...(telemetryConfig.url ? { endpoint: telemetryConfig.url } : {}),
    ...(telemetryConfig.key ? { apiKey: telemetryConfig.key } : {}),
    adapter: createWebAdapter(),
  })
    .then((obs) => {
      // Instrument global fetch (traceparent injection, timing, route capture).
      try {
        const original = globalThis.fetch.bind(globalThis);
        globalThis.fetch = obs.http() as typeof fetch;
        void original;
      } catch { /* noop */ }
      // Page lifecycle breadcrumbs + flush on hide.
      try {
        obs.event("app.started", { cold_start: true });
        window.addEventListener("pagehide", () => {
          try {
            obs.event("app.backgrounded");
            void obs.flush();
          } catch { /* noop */ }
        });
        document.addEventListener("visibilitychange", () => {
          try {
            if (document.visibilityState === "visible") obs.event("app.foregrounded");
          } catch { /* noop */ }
        });
      } catch { /* noop */ }
    })
    .catch((error) => {
      console.debug("[observability] init failed (non-fatal)", error);
    });
}

export { getObservability };

export type TelemetryAttributes = Record<
  string,
  string | number | boolean | undefined
>;

/** Fire-and-forget domain event. Never throws, safe before init. */
export function trackEvent(name: string, attrs?: TelemetryAttributes): void {
  try {
    getObservability()?.event(name, attrs as never);
          } catch { /* noop */ }
}

const SCREEN_NAMES: Record<string, string> = {
  about: "About",
  biz: "BusinessPage",
  business: "BusinessLanding",
  contact: "Contact",
  "delete-account": "DeleteAccount",
  desktop: "DesktopLanding",
  faq: "Faq",
  invite: "InviteLanding",
  legal: "Legal",
  order: "OrderLanding",
  "reset-password": "ResetPassword",
  rider: "RiderLanding",
  whatsapp: "WhatsAppLanding",
};

const TEMPLATE_SCREENS: Record<string, string> = {
  "/business/apply": "BusinessApply",
  "/order": "OrderLanding",
};

function isIdSegment(seg: string): boolean {
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(seg) ||
    /^[0-9]{2,}$/.test(seg) ||
    (seg.length >= 16 && /^[0-9a-zA-Z_-]+$/.test(seg))
  ) {
    return true;
  }
  // Coded ids (BIZ-001, order_123) — digits plus a separator.
  return /[0-9]/.test(seg) && /[-_]/.test(seg);
}

function capitalize(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

/**
 * Maps a next-intl pathname (locale-prefixed) to a human screen name and a
 * normalized route template. Id-like segments collapse to {id}.
 */
export function describeRoute(pathname: string): {
  screen: string;
  route_template: string;
} {
  const segs = pathname
    .split("/")
    .filter((s) => s.length > 0)
    .filter((s, i) => !(i === 0 && (locales as readonly string[]).includes(s)));
  if (segs.length === 0) return { screen: "Home", route_template: "/" };

  const [head, ...rest] = segs;
  const template: string[] = [head];
  let refiner = "";
  for (const seg of rest) {
    if (isIdSegment(seg)) {
      template.push("{id}");
    } else {
      template.push(seg);
      if (!refiner) refiner = capitalize(seg);
    }
  }
  const templateStr = `/${template.join("/")}`;
  const needsComposition = !(head in SCREEN_NAMES);
  const screen =
    TEMPLATE_SCREENS[templateStr] ??
    (needsComposition ? capitalize(head) + refiner : (SCREEN_NAMES[head] ?? capitalize(head)));
  return { screen, route_template: templateStr };
}

/**
 * Emits screen.view with a human screen name + normalized template.
 * Mount once inside a client component in the root layout.
 */
export function useScreenTracking(): void {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    try {
      const { screen, route_template } = describeRoute(pathname ?? "/");
      trackEvent("screen.view", {
        screen,
        route: route_template,
        ...(first.current ? { cold_start: true } : {}),
      });
            } catch { /* noop */ }
    first.current = false;
  }, [pathname]);
}

/**
 * Runs fn inside a span. Falls back to running fn directly when telemetry is
 * uninitialized. Critical paths force sampling.
 */
export async function traceOp<T>(
  name: string,
  fn: (_span: never) => T | Promise<T>,
  sampled?: boolean,
): Promise<T> {
  const run = () => fn(undefined as never);
  try {
    const obs = getObservability();
    if (!obs) return run();
    return obs.trace(
      name,
      fn as never,
      ...(sampled === undefined ? [] : [{ sampled }]),
    ) as Promise<T>;
  } catch {
    return run();
  }
}
