import { NextResponse } from "next/server";

export const runtime = "nodejs";

const API_BASE = process.env.TEINCFOOD_API_BASE_URL || "";
const emailRegex = /^\S+@\S+\.\S+$/;

/**
 * Proxies the website contact form to the TeincFood backend, which relays the
 * message to the support inbox using its configured email provider.
 */
export async function POST(req: Request) {
  if (!API_BASE) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !emailRegex.test(email) || !message) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 502 },
    );
  }
}
