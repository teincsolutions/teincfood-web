import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = process.env.TEINCFOOD_API_BASE_URL || "";

type ActionDef = { path: string };

const ACTIONS: Record<string, ActionDef> = {
  forgot_password: { path: "/auth/forgot-password" },
  reset_password: { path: "/auth/reset-password" },
};

/**
 * Server-side proxy to the Teinc Food backend for password recovery, keeping
 * the backend URL and any SMTP credentials out of client-side code.
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

  try {
    const res = await fetch(`${API_BASE}${def.path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body.payload ?? {}),
    });

    const data = await res.json().catch(() => ({}));

    return NextResponse.json(data, { status: res.status });
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