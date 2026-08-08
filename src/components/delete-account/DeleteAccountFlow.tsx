"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Smartphone,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { authConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Method = "phone" | "email" | "oidc";
type OidcProvider = "google" | "apple";
type Step = "method" | "verify" | "confirm" | "done";
type Status = "idle" | "loading" | "error" | "ok";

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
  const [error, setError] = useState("");
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
    setError("");
    const { ok, data } = await callApi("send_otp", {
      phone: phone.trim(),
      purpose: "login",
    });
    setStatus("idle");
    if (!ok) {
      setError(errorMessage(data, t("errors.phoneSend")));
      return false;
    }
    setOtpSent(true);
    setResendIn(RESEND_SECONDS);
    return true;
  };

  const handleSendOtp = async (e?: FormEvent) => {
    e?.preventDefault();
    const normalized = phone.trim();
    if (!normalized) {
      setError(t("errors.invalidPhone"));
      return;
    }
    await submitOtp();
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const { ok, data } = await callApi("verify_otp", {
      phone: phone.trim(),
      code: code.trim(),
    });
    setStatus("idle");
    if (!ok || !data.access_token) {
      setError(errorMessage(data, t("errors.otpVerify")));
      return;
    }
    nextAfterAuth(data.user ?? {});
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const { ok, data } = await callApi("login", {
      email: email.trim(),
      password,
    });
    setStatus("idle");
    if (!ok || !data.access_token) {
      setError(errorMessage(data, t("errors.login")));
      return;
    }
    nextAfterAuth(data.user ?? {});
  };

  const handleOidc = async (provider: OidcProvider) => {
    setStatus("loading");
    setError("");
    const idToken = await obtainIdToken(provider);
    if (!idToken) {
      setStatus("error");
      setError(t("errors.oidc"));
      return;
    }
    const { ok, data } = await callApi("oidc", {
      provider,
      id_token: idToken,
    });
    setStatus("idle");
    if (!ok || !data.access_token) {
      setError(errorMessage(data, t("errors.oidc")));
      return;
    }
    nextAfterAuth(data.user ?? {});
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const { ok, data } = await callApi("delete_account", {});
    setStatus("idle");
    if (!ok) {
      setError(errorMessage(data, t("errors.delete")));
      return;
    }
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
            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
              <Field label={t("form.phone")}>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+233…"
                  className={inputClass}
                />
              </Field>

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
            </form>
          )}

          {method === "email" && (
            <form onSubmit={handleEmailLogin} className="mt-6 space-y-4">
              <Field label={t("form.email")}>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label={t("form.password")}>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
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
              <Button variant="outline" size="lg" className="w-full" disabled={busy} onClick={() => handleOidc("google")}>
                {busy ? <Spinner /> : <Mail className="size-5" aria-hidden="true" />}
                {t("form.google")}
              </Button>
              <Button variant="outline" size="lg" className="w-full" disabled={busy} onClick={() => handleOidc("apple")}>
                {busy ? <Spinner /> : <Mail className="size-5" aria-hidden="true" />}
                {t("form.apple")}
              </Button>
              {!authConfig.googleClientId && !authConfig.appleClientId && (
                <p className="text-sm text-navy/50">{t("errors.oidcConfig")}</p>
              )}
            </div>
          )}

          {error && <ErrorMsg className="mt-4">{error}</ErrorMsg>}
        </div>
      )}

      {step === "verify" && (
        <div className="mt-8">
          <p className="text-navy/70">{t("form.verifyIntro", { phone })}</p>
          <form onSubmit={handleVerifyOtp} className="mt-4 space-y-4">
            <Field label={t("form.code")}>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={inputClass}
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
            {error && <ErrorMsg>{error}</ErrorMsg>}
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

          <form onSubmit={handleDelete} className="space-y-4">
            <Field label={t("confirm.typeDelete")}>
              <input
                type="text"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                className={cn(inputClass, "uppercase tracking-widest")}
              />
            </Field>
            {error && <ErrorMsg>{error}</ErrorMsg>}
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-navy">{label}</span>
      {children}
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

function ErrorMsg({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-sm font-semibold text-red-600", className)}>{children}</p>;
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
    const gsi = (window as unknown as {
      google?: {
        accounts?: {
          id: {
            initialize: (_opts: {
              client_id: string;
              callback: (_res: { credential: string }) => void;
            }) => void;
            prompt: () => void;
          };
        };
      };
    }).google?.accounts;
    if (!gsi) {
      const loaded = await loadScript("https://accounts.google.com/gsi/client", "teinc-gsi");
      if (!loaded) return null;
    }
    return new Promise((resolve) => {
      let settled = false;
      const accounts = (window as unknown as {
        google: { accounts: { id: { initialize: (_opts: { client_id: string; callback: (_res: { credential: string }) => void }) => void; prompt: () => void } } };
      }).google.accounts;
      accounts.id.initialize({
        client_id: clientId,
        callback: (res) => {
          if (!settled) {
            settled = true;
            resolve(res.credential || null);
          }
        },
      });
      accounts.id.prompt();
      setTimeout(() => {
        if (!settled) {
          settled = true;
          resolve(null);
        }
      }, 60000);
    });
  }

  const clientId = authConfig.appleClientId;
  if (!clientId) return null;
  const apple = (window as unknown as {
    AppleID?: {
      signIn: (_opts?: {
        clientId?: string;
        redirectURI?: string;
        scope?: string;
        usePopup?: boolean;
      }) => Promise<{ authorization?: { id_token?: string } }>;
    };
  }).AppleID;
  if (!apple) {
    const loaded = await loadScript(
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js",
      "teinc-apple",
    );
    if (!loaded) return null;
  }
  try {
    const res = await (window as unknown as {
      AppleID: {
        signIn: (_opts?: {
          clientId?: string;
          redirectURI?: string;
          scope?: string;
          usePopup?: boolean;
        }) => Promise<{ authorization?: { id_token?: string } }>;
      };
    }).AppleID.signIn({
      clientId,
      redirectURI: window.location.origin,
      scope: "email",
      usePopup: true,
    });
    return res?.authorization?.id_token || null;
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