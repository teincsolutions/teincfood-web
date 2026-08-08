import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = process.env.TEINCFOOD_API_BASE_URL || "";

const TOKEN_COOKIE = "teinc_delete_token";

type ActionDef = { path: string; method?: string; requiresAuth?: boolean };

const ACTIONS: Record<string, ActionDef> = {
  send_otp: { path: "/auth/otp/send", method: "POST" },
  verify_otp: { path: "/auth/otp/verify", method: "POST" },
  login: { path: "/auth/login", method: "POST" },
  oidc: { path: "/auth/oidc", method: "POST" },
  delete_account: {
    path: "/users/me/delete",
    method: "DELETE",
    requiresAuth: true,
  },
};

/**
 * Server-side proxy to the Teinc Food backend for the account-deletion flow.
 * The access token returned on verify/login/oidc is kept in an httpOnly cookie
 * and attached to the final deletion request, keeping it out of client JS.
 */
export async function POST(req: NextRequest) {
  if (!API_BASE) {
    return NextResponse.json(
      {
        error: { code: "SERVICE_UNCONFIGURED", message: "Service unavailable" },
      },
      { status: 503 },
    );
  }

  let body: { action?: unknown; payload?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid JSON" } },
      { status: 400 },
    );
  }

  const def = ACTIONS[String(body.action ?? "")];

  if (!def) {
    return NextResponse.json(
      { error: { code: "UNKNOWN_ACTION", message: "Unknown action" } },
      { status: 400 },
    );
  }

  const token = def.requiresAuth
    ? req.cookies.get(TOKEN_COOKIE)?.value
    : undefined;

  if (def.requiresAuth && !token) {
    return NextResponse.json(
      { error: { code: "UNAUTHENTICATED", message: "Not authenticated" } },
      { status: 401 },
    );
  }

  try {
    const res = await fetch(`${API_BASE}${def.path}`, {
      method: def.method ?? "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(def.method === "DELETE" ? {} : { body: JSON.stringify(body.payload ?? {}) }),
    });

    const is204 = res.status === 204;
    const data = is204 ? {} : await res.json().catch(() => ({}));

    const headers = new Headers();

    // Persist a newly issued access token in an HttpOnly cookie.
    const accessToken =
      typeof data.access_token === "string" ? data.access_token : undefined;
    if (accessToken) {
      headers.append(
        "Set-Cookie",
        `${TOKEN_COOKIE}=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${15 * 60}`,
      );
    }

    if (is204) {
      return new Response(null, { status: 204, headers });
    }

    return NextResponse.json(data, { status: res.status, headers });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "UPSTREAM_ERROR",
          message: "Service temporarily unavailable",
        },
      },
      { status: 502 },
    );
  }
}
