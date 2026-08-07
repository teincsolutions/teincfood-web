import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";

function makeTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER || process.env.GMAIL_EMAIL;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_KEY;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email) || !message) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const transporter = makeTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"${siteConfig.name} Website" <${process.env.FROM_EMAIL || siteConfig.contactEmail}>`,
        to: siteConfig.contactEmail,
        replyTo: email,
        subject: `Contact form: ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      });
    } catch (err) {
      console.error("Contact email failed", err);
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}