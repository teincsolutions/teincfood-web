import { NextRequest, NextResponse } from "next/server";
import { API_CONFIGURED, apiUrl } from "@/lib/api-base";

export const runtime = "nodejs";

/**
 * Apple OAuth callback for desktop sign-in.
 *
 * Apple sends a form_post with `id_token`, `code`, and `state`.
 * We forward the id_token and state to the backend's
 * `/api/v1/auth/apple/web-callback` which verifies the token and
 * redirects to `teincfood://auth?access_token=...&refresh_token=...`.
 *
 * NOTE: We return a raw Response for the deep-link redirect because
 * NextResponse.redirect does not reliably handle custom schemes like
 * `teincfood://`.
 */
export async function POST(req: NextRequest) {
  if (!API_CONFIGURED) {
    return NextResponse.json(
      { error: { code: "SERVICE_UNCONFIGURED", message: "Backend not configured" } },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_REQUEST", message: "Invalid form data" } },
      { status: 400 },
    );
  }

  const idToken = formData.get("id_token");
  const state = formData.get("state");

  if (!idToken || !state) {
    return NextResponse.json(
      { error: { code: "INVALID_REQUEST", message: "Missing id_token or state" } },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(apiUrl("/auth/apple/web-callback"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token: idToken, state }),
      redirect: "manual",
    });

    // The backend returns a 302 redirect to teincfood://auth?...
    if (res.status === 302 || res.status === 301) {
      const location = res.headers.get("Location");
      if (location) {
        return new Response(null, {
          status: 302,
          headers: { Location: location },
        });
      }
    }

    // If backend returned something else, forward the error
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { error: { code: "UPSTREAM_ERROR", message: "Backend temporarily unavailable" } },
      { status: 502 },
    );
  }
}
