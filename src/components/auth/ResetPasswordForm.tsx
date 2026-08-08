"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Status =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "invalid"
  | "noToken";

type BackendError = {
  error?: { code?: unknown; message?: string };
};

export function ResetPasswordForm() {
  const t = useTranslations("resetPassword");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<Status>(token ? "idle" : "noToken");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setStatus("error");
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_password",
          payload: { token, password },
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as BackendError;
        const message = data.error?.message;
        setStatus(message ? "invalid" : "error");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center font-semibold text-green-700">
        {t("success")}
      </p>
    );
  }

  if (status === "noToken") {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center font-semibold text-red-700">
        {t("invalidRequest")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label={t("newPassword")} hint={t("passwordHint")}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-xl border border-navy/15 bg-surface px-4 py-3 text-navy outline-none transition-colors focus:border-orange focus:outline focus:outline-2 focus:outline-orange/30"
        />
      </Field>
      <Field label={t("confirmPassword")}>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-xl border border-navy/15 bg-surface px-4 py-3 text-navy outline-none transition-colors focus:border-orange focus:outline focus:outline-2 focus:outline-orange/30"
        />
      </Field>

      {(status === "error" || status === "invalid") && (
        <p className="text-sm font-semibold text-red-600">
          {status === "invalid" ? t("invalidRequest") : t("error")}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="w-full sm:w-auto"
      >
        <KeyRound className="size-5" aria-hidden="true" />
        {t("submit")}
      </Button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-navy">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-sm text-navy/50">{hint}</span>}
    </label>
  );
}