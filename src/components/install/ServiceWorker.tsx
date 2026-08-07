"use client";

import { useEffect } from "react";

export function ServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const registration = navigator.serviceWorker.register("/sw.js");
    return () => {
      registration.then((reg) => reg.unregister()).catch(() => undefined);
    };
  }, []);

  return null;
}