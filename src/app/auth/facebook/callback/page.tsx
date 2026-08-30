"use client";

import { useEffect } from "react";

/**
 * Facebook OAuth callback for desktop sign-in.
 *
 * Facebook returns the access_token in the URL fragment (#access_token=...).
 * This client-side page extracts it and redirects to the teincfood:// deep link
 * so the desktop app can capture the token.
 */
export default function FacebookCallbackPage() {
  useEffect(() => {
    // Fragment (#) is never sent to the server, so we parse it client-side.
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);

    // Also check query string for code flow or error
    const qs = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token") ?? qs.get("access_token");
    const state = params.get("state") ?? qs.get("state");
    const error = params.get("error") ?? qs.get("error") ?? qs.get("error_reason");
    const errorDesc = params.get("error_description") ?? qs.get("error_description");

    if (error) {
      const msg = errorDesc || error;
      window.location.href = `teincfood://auth?error=${encodeURIComponent(msg)}`;
      return;
    }

    if (accessToken) {
      const query = new URLSearchParams();
      query.set("access_token", accessToken);
      if (state) query.set("state", state);
      window.location.href = `teincfood://auth?${query.toString()}`;
      return;
    }

    // Facebook OAuth dialog returns ?error=access_denied when cancelled
    if (window.location.search.includes("error")) {
      window.location.href = "teincfood://auth?error=cancelled";
      return;
    }
    window.location.href = "teincfood://auth?error=cancelled";
  }, []);

  return (
    <div className="flex h-screen items-center justify-center text-sm text-muted">
      Completing sign-in…
    </div>
  );
}
