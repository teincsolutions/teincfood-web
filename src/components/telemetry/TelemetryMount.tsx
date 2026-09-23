"use client";

import { useEffect } from "react";
import { ensureObservability, useScreenTracking } from "@/utils/observability";

/**
 * Boots telemetry once and emits screen.view on route changes. Renders nothing;
 * mount once in the root layout.
 */
export function TelemetryMount() {
  useEffect(() => {
    ensureObservability();
  }, []);

  useScreenTracking();

  return null;
}
