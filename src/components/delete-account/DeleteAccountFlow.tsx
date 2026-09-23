"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Smartphone,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { authConfig } from "@/config/site";
import { toast } from "@/components/ui/Toaster";
import { trackEvent } from "@/utils/observability";
import { appleAuthHelpers } from "react-apple-signin-auth";
import { cn } from "@/lib/utils";

type Method = "phone" | "email" | "oidc";
type OidcProvider = "google" | "apple";
type Step = "method" | "verify" | "confirm" | "done";
type Status = "idle" | "loading";

interface IdentifiedAccount {
  id: string;
  email: string | null;
  phone: string | null;
}

const RESEND_SECONDS = 60;

export function DeleteAccountFlow() {
  const t = useTranslations("deleteAccount");

  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<Method>("phone");

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [account, setAccount] = useState<IdentifiedAccount | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState("");

  

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => {
      setResendIn((v) => (v <= 1 ? 0 : v - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  const callApi = useCallback(async (action: string, payload: unknown) => {
    const res = await fetch("/api/delete-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }, []);

  const errorMessage = (data: unknown, fallback: string) => {
    const e = (data as { error?: { message?: string } })?.error?.message;
    return e || fallback;
  };

  const setFieldError = (field: string, message?: string) =>
    setFieldErrors((prev) => ({ ...prev, [field]: message ?? "" }));

  const nextAfterAuth = (user: { id?: string; email?: string | null; phone?: string | null }) => {
    setAccount({
      id: user?.id ?? "",
      email: user?.email ?? null,
      phone: user?.phone ?? null,
    });
    setStep("confirm");
  };

  const submitOtp = async () => {
    setStatus("loading");
    const { ok, status, data } = await callApi("send_otp", {
      phone: phone.trim(),
      purpose: "login",
    });
    setStatus("idle");
    if (!ok) {
      trackEvent("account.delete.otp_failed", { status });
      toast.error(errorMessage(data, t("errors.phoneSend")));
      return false;
    }
    trackEvent("account.delete.otp_sent");
    toast.success(t("toast.codeSent", { phone: phone.trim() }));
    setOtpSent(true);
    setResendIn(RESEND_SECONDS);
    return true;
  };

  const handleSendOtp = async (e?: FormEvent) => {
    e?.preventDefault();
    const normalized = phone.trim();
    const nextErr: Record<string, string> = {};
    if (!normalized) nextErr.phone = t("errors.phoneRequired");
    else if (!/^\+?\d[\d\s-]{6,}$/.test(normalized)) nextErr.phone = t("errors.invalidPhone");
    setFieldErrors((prev) => ({ ...prev, ...nextErr }));
    if (nextErr.phone) return;
    setFieldError("phone");
    await submitOtp();
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setFieldError("code", t("errors.codeRequired"));
      return;
    }
    setFieldErrors((prev) => ({ ...prev, code: "" }));
    setStatus("loading");
    const { ok, status, data } = await callApi("verify_otp", {
      phone: phone.trim(),
      code: code.trim(),
    });
    setStatus("idle");
    if (!ok || !data.access_token) {
      trackEvent("account.delete.verify_failed", { status });
      toast.error(errorMessage(data, t("errors.otpVerify")));
      return;
    }
    trackEvent("account.delete.identity_verified");
    toast.success(t("toast.identityVerified"));
    nextAfterAuth(data.user ?? {});
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    const nextErr: Record<string, string> = {};
    if (!email.trim()) nextErr.email = t("errors.emailRequired");
    if (!password) nextErr.password = t("errors.passwordRequired");
    setFieldErrors((prev) => ({ ...prev, ...nextErr }));
    if (Object.keys(nextErr).length > 0) return;
    setStatus("loading");
    const { ok, status, data } = await callApi("login", {
      email: email.trim(),
      password,
    });
    setStatus("idle");
    if (!ok || !data.access_token) {
      trackEvent("account.delete.verify_failed", { method: "email", status });
      toast.error(errorMessage(data, t("errors.login")));
      return;
    }
    trackEvent("account.delete.identity_verified", { method: "email" });
    toast.success(t("toast.signedIn"));
    nextAfterAuth(data.user ?? {});
  };

  const handleOidc = async (provider: OidcProvider) => {
    setStatus("loading");
    const idToken = await obtainIdToken(provider);
    if (!idToken) {
      setStatus("idle");
      trackEvent("account.delete.verify_failed", { method: "oidc", provider, status: 0 });
      toast.error(t("errors.oidc"));
      return;
    }
    const { ok, status, data } = await callApi("oidc", {
      provider,
      id_token: idToken,
    });
    setStatus("idle");
    if (!ok || !data.access_token) {
      trackEvent("account.delete.verify_failed", { method: "oidc", provider, status });
      toast.error(errorMessage(data, t("errors.oidc")));
      return;
    }
    trackEvent("account.delete.identity_verified", { method: "oidc", provider });
    toast.success(t("toast.signedIn"));
    nextAfterAuth(data.user ?? {});
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    if (confirm.trim().toUpperCase() !== "DELETE") {
      setFieldError("confirm", t("errors.confirmRequired"));
      return;
    }
    setFieldErrors((prev) => ({ ...prev, confirm: "" }));
    setStatus("loading");
    const { ok, status, data } = await callApi("delete_account", {});
    setStatus("idle");
    if (!ok) {
      trackEvent("account.delete.failed", { status });
      toast.error(errorMessage(data, t("errors.delete")));
      return;
    }
    trackEvent("account.deleted");
    toast.success(t("toast.accountDeleted"));
    setStep("done");
  };

  const busy = status === "loading";
  const confirmEnabled = confirm.trim().toUpperCase() === "DELETE" && !busy;

  return (
    <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <StepIndicator step={step} />

      {step === "method" && (
        <div className="mt-8">
          <MethodTabs method={method} onChange={setMethod} />

          {method === "phone" && (
            <form onSubmit={handleSendOtp} className="mt-6 space-y-4" noValidate>
              <Field label={t("form.phone")} error={fieldErrors.phone}>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setFieldError("phone");
                  }}
                  placeholder="+233…"
                  aria-invalid={!!fieldErrors.phone}
                  className={cn(inputClass, fieldErrors.phone && inputErrorClass)}
                />
              </Field>

              {otpSent && (
                <Field label={t("form.code")} error={fieldErrors.code}>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setFieldError("code");
                    }}
                    aria-invalid={!!fieldErrors.code}
                    className={cn(inputClass, fieldErrors.code && inputErrorClass)}
                  />
                </Field>
              )}

              {!otpSent ? (
                <Button type="submit" variant="primary" size="lg" disabled={busy} className="w-full sm:w-auto">
                  {busy ? <Spinner /> : <Smartphone className="size-5" aria-hidden="true" />}
                  {t("form.sendCode")}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  disabled={busy || !code.trim()}
                  className="w-full sm:w-auto"
                  onClick={() => setStep("verify")}
                >
                  {busy ? <Spinner /> : <ShieldCheck className="size-5" aria-hidden="true" />}
                  {`${t("form.verify")} →`}
                </Button>
              )}

              {otpSent && (
                <div className="flex items-center gap-2">
                  {resendIn > 0 ? (
                    <p className="text-sm text-navy/50">{t("form.resendIn", { seconds: resendIn })}</p>
                  ) : (
                    <button type="button" onClick={() => submitOtp()} className="text-sm font-semibold text-orange hover:underline">
                      {t("form.resend")}
                    </button>
                  )}
                </div>
              )}
            </form>
          )}

          {method === "email" && (
            <form onSubmit={handleEmailLogin} className="mt-6 space-y-4" noValidate>
              <Field label={t("form.email")} error={fieldErrors.email}>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldError("email");
                  }}
                  aria-invalid={!!fieldErrors.email}
                  className={cn(inputClass, fieldErrors.email && inputErrorClass)}
                />
              </Field>
              <Field label={t("form.password")} error={fieldErrors.password}>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldError("password");
                  }}
                  aria-invalid={!!fieldErrors.password}
                  className={cn(inputClass, fieldErrors.password && inputErrorClass)}
                />
              </Field>
              <Button type="submit" variant="primary" size="lg" disabled={busy} className="w-full sm:w-auto">
                {busy ? <Spinner /> : <KeyRound className="size-5" aria-hidden="true" />}
                {t("form.continue")}
              </Button>
            </form>
          )}

          {method === "oidc" && (
            <div className="mt-6 space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SocialButton
                  variant="google"
                  onClick={() => handleOidc("google")}
                  disabled={busy || !authConfig.googleClientId}
                  spinner={busy}
                  title={!authConfig.googleClientId ? t("errors.oidcGoogle") : undefined}
                >
                  {t("form.google")}
                </SocialButton>
                <SocialButton
                  variant="apple"
                  onClick={() => handleOidc("apple")}
                  disabled={busy || !authConfig.appleClientId}
                  spinner={busy}
                  title={!authConfig.appleClientId ? t("errors.oidcApple") : undefined}
                >
                  {t("form.apple")}
                </SocialButton>
              </div>
              {(!authConfig.googleClientId || !authConfig.appleClientId) && (
                <p className="text-sm text-navy/50">{t("errors.oidcConfig")}</p>
              )}
            </div>
          )}
        </div>
      )}

      {step === "verify" && (
        <div className="mt-8">
          <p className="text-navy/70">{t("form.verifyIntro", { phone })}</p>
          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4" noValidate>
            <Field label={t("form.code")} error={fieldErrors.code}>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setFieldError("code");
                }}
                aria-invalid={!!fieldErrors.code}
                className={cn(inputClass, fieldErrors.code && inputErrorClass)}
              />
            </Field>
            <div className="flex items-center gap-2 sm:gap-3">
              <BackButton onClick={() => setStep("method")} />
              <Button type="submit" variant="primary" size="lg" disabled={busy || !code}>
                {busy ? <Spinner /> : <ShieldCheck className="size-5" aria-hidden="true" />}
                {t("form.verify")}
              </Button>
            </div>
            {resendIn > 0 ? (
              <p className="text-sm text-navy/50">{t("form.resendIn", { seconds: resendIn })}</p>
            ) : (
              <button type="button" onClick={() => submitOtp()} className="mx-auto block text-sm font-semibold text-orange hover:underline">
                {t("form.resend")}
              </button>
            )}
          </form>
        </div>
      )}

      {step === "confirm" && account && (
        <div className="mt-8 space-y-5">
          <div className="rounded-2xl border border-orange/25 bg-orange-50/50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-orange-700" aria-hidden="true" />
              <div>
                <p className="font-bold text-navy">{t("confirm.warning")}</p>
                <p className="mt-1 text-sm text-navy/70">{t("confirm.deleted")}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-border bg-surface p-5">
            <Row label={t("confirm.email")} value={account.email ?? "—"} />
            <Row label={t("confirm.phone")} value={account.phone ?? "—"} />
            <Row label={t("confirm.id")} value={account.id} />
          </div>

          <form onSubmit={handleDelete} className="space-y-4" noValidate>
            <Field label={t("confirm.typeDelete")} error={fieldErrors.confirm}>
              <input
                type="text"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setFieldError("confirm");
                }}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                aria-invalid={!!fieldErrors.confirm}
                className={cn(inputClass, "uppercase tracking-widest", fieldErrors.confirm && inputErrorClass)}
              />
            </Field>
            <div className="flex items-center gap-4 sm:gap-3">
              <BackButton onClick={() => setStep("method")} />
              <Button
                type="submit"
                variant="outline"
                size="lg"
                disabled={!confirmEnabled}
                className="border-red-600 text-red-600 hover:border-red-700 hover:bg-red-600"
              >
                {busy ? <Spinner /> : <ShieldCheck className="size-5" aria-hidden="true" />}
                {t("form.delete")}
              </Button>
            </div>
          </form>
        </div>
      )}

      {step === "done" && (
        <div className="mt-10 text-center">
          <CheckCircle2 className="mx-auto size-14 text-green-600" aria-hidden="true" />
          <h3 className="mt-5 text-2xl font-extrabold text-navy">{t("done.title")}</h3>
          <p className="mx-auto mt-3 max-w-md text-navy/70">{t("done.body")}</p>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-navy/15 bg-surface px-4 py-3 text-navy outline-none transition-colors focus:border-orange focus:outline focus:outline-2 focus:outline-orange/30";
const inputErrorClass = "border-red-500 focus:border-red-500 focus:outline-red-500/30";

// --- sub-components ---

function StepIndicator({ step }: { step: Step }) {
  const t = useTranslations("deleteAccount");
  const order: Step[] = ["method", "verify", "confirm", "done"];
  const index = order.indexOf(step);
  const labels = [t("step.identify"), t("step.verify"), t("step.confirm"), t("step.done")];
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {order.map((s, i) => {
        const active = i === index;
        const done = i < index;
        return (
          <li key={s} className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-8 place-items-center rounded-full text-center text-sm font-bold",
                done || active ? "bg-orange text-white" : "bg-surface text-navy/40",
              )}
            >
              {done ? <CheckCircle2 className="size-4" aria-hidden="true" /> : i + 1}
            </span>
            <span className={cn("hidden text-sm font-semibold sm:inline", active ? "text-navy" : "text-navy/40")}>
              {labels[i]}
            </span>
            {i < order.length - 1 && <span className="h-px w-4 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}

function MethodTabs({ method, onChange }: { method: Method; onChange: (_m: Method) => void }) {
  const t = useTranslations("deleteAccount");
  const tabs: { key: Method; label: string }[] = [
    { key: "phone", label: t("method.phone") },
    { key: "email", label: t("method.email") },
    { key: "oidc", label: t("method.oidc") },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            method === tab.key
              ? "border-orange bg-orange/10 text-orange-700"
              : "border-border text-navy/60 hover:border-navy/30",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-navy">{label}</span>
      {children}
      {error && (
        <span className="mt-1.5 block text-sm font-semibold text-red-600" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-navy/50">{label}</span>
      <span className="font-semibold text-navy">{value}</span>
    </div>
  );
}

function Spinner() {
  return <Loader2 className="size-5 animate-spin" aria-hidden="true" />;
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-5", className)} aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.61 20.14H42V20H24v8h11.3C33.7 32.66 29.22 36 24 36c-6.63 0-12-5.37-12-12s5.37-12 12-12c3.06 0 5.84 1.16 7.95 3.05l5.66-5.66C34.45 6.47 29.5 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.32-.13-2.6-.39-3.86z"
      />
      <path
        fill="#FF3D00"
        d="M6.31 14.68l6.6 4.84C14.68 16.15 18.98 13 24 13c3.06 0 5.84 1.16 7.95 3.05l5.66-5.66C34.45 6.47 29.5 4 24 4 16.32 4 9.65 8.32 6.31 14.68z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.16 0 9.93-1.78 13.64-4.73l-6.3-5.39C29.22 35.2 26.72 36 24 36c-5.22 0-9.7-3.34-11.42-8.04l-6.52 5.02C9.4 37.2 16.1 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.61 20.14H42V20H24v8h11.3c-.77 2.16-2.13 3.93-3.96 4.8.04-.02 5.72-4.6 6.84-4.6.04 0-4.9-8.06-5.9-8.06z"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-5", className)} aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13.96 5.4c.64-.83 1.07-1.99.87-3.15-.84.03-1.9.56-2.51 1.28-.57.66-1.07 1.73-.93 2.75.86.08 1.07-.55 2.57-.88z"
      />
    </svg>
  );
}

function SocialButton({
  variant,
  onClick,
  disabled,
  spinner,
  title,
  children,
}: {
  variant: "google" | "apple";
  onClick: () => void;
  disabled?: boolean;
  spinner?: boolean;
  title?: string;
  children: ReactNode;
}) {
  const styles =
    variant === "google"
      ? "border-navy/10 bg-white text-navy hover:border-navy/25"
      : "border-black bg-black text-white hover:bg-navy";

  return (
    <Button
      type="button"
      variant="outline"
      size="md"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn("w-full", styles, disabled && !spinner && "opacity-60")}
    >
      {spinner ? (
        <Spinner />
      ) : variant === "google" ? (
        <GoogleIcon />
      ) : (
        <AppleIcon />
      )}
      {children}
    </Button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations("deleteAccount");
  return (
    <Button type="button" variant="ghost" size="md" onClick={onClick}>
      <ArrowLeft className="size-4" aria-hidden="true" />
      {t("form.back")}
    </Button>
  );
}

// --- OIDC id_token acquisition ---

async function obtainIdToken(provider: OidcProvider): Promise<string | null> {
  if (typeof window === "undefined") return null;

  if (provider === "google") {
    const clientId = authConfig.googleClientId;
    if (!clientId) return null;

    let gsi = window.google?.accounts?.id;
    if (!gsi) {
      const loaded = await loadScript("https://accounts.google.com/gsi/client", "teinc-gsi");
      if (!loaded) return null;
      gsi = window.google?.accounts?.id;
    }
    if (!gsi) return null;

    return new Promise((resolve) => {
      let settled = false;
      const finish = (credential: string | null) => {
        if (!settled) {
          settled = true;
          resolve(credential);
        }
      };

      gsi?.initialize({
        client_id: clientId,
        ux_mode: "popup",
        callback: (res) => finish(res.credential || null),
      });

      gsi?.prompt((notification) => {
        // Treat a skipped/dismissed prompt as a cancelled sign-in.
        if (notification.isSkippedMoment() || notification.isDismissedMoment()) {
          finish(null);
        }
      });

      setTimeout(() => finish(null), 60000);
    });
  }

  const clientId = authConfig.appleClientId;
  if (!clientId) return null;

  // Official Apple JS SDK must be present before the helper runs.
  if (!window.AppleID?.auth) {
    const loaded = await loadScript(
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js",
      "teinc-apple",
    );
    if (!loaded) return null;
  }

  try {
    const response = await appleAuthHelpers.signIn({
      authOptions: {
        clientId,
        redirectURI: window.location.origin,
        scope: "name email",
        usePopup: true,
      },
      // Apple rejects the promise with an empty error object on failures such
      // as an unregistered redirect URI or a non-HTTPS origin. We swallow that
      // and let the caller surface its own i18n error via toast.
      onError: () => {},
    });
    return response?.authorization?.id_token ?? null;
  } catch {
    return null;
  }
}

function loadScript(src: string, id: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById(id)) return resolve(true);
    const s = document.createElement("script");
    s.id = id;
    s.src = src;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}